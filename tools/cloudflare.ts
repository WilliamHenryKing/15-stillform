import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createConnection } from "node:net";
import { dirname, join, relative, resolve } from "node:path";

// Project-local release staging. Neither action makes a network request or uploads files.
const root = realpathSync(resolve(import.meta.dir, ".."));
const output = join(root, "output", "cloudflare");
const site = join(output, "site");
const receiptPath = join(output, "receipt.json");
const configPath = join(root, "wrangler.jsonc");
const maxAssetBytes = 25 * 1024 * 1024;
const maxFiles = 20_000;
const controls = new Set(["_headers", "_redirects", ".assetsignore"]);
const allowedExtensions = /\.(html|css|js|svg|webp|png|jpg|jpeg|avif|ico|woff2|txt|xml)$/;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function git(...args: string[]) {
  const result = Bun.spawnSync(["git", ...args], { cwd: root });
  assert(result.exitCode === 0, `git ${args[0]} failed`);
  return result.stdout.toString().trim();
}

function hash(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

async function previewIsRunning(port: number) {
  return new Promise<boolean>((done) => {
    const socket = createConnection({ host: "127.0.0.1", port });
    const finish = (active: boolean) => {
      socket.destroy();
      done(active);
    };
    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
    socket.setTimeout(1000, () => finish(true));
  });
}

function files(directory: string, skipBuildMetadata = false): string[] {
  assert(existsSync(directory), `Missing ${relative(root, directory)}; run cloudflare:prepare.`);
  assert(!lstatSync(directory).isSymbolicLink(), `Symlinks are not release inputs: ${directory}`);
  return readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      if (skipBuildMetadata && entry.name === ".vite") return [];
      const path = join(directory, entry.name);
      assert(!entry.isSymbolicLink(), `Symlinks are not release inputs: ${path}`);
      if (entry.isDirectory()) return files(path, skipBuildMetadata);
      assert(entry.isFile(), `Unexpected release input: ${path}`);
      assert(
        controls.has(entry.name) || allowedExtensions.test(entry.name),
        `Unexpected public file: ${path}`,
      );
      assert(
        !entry.name.startsWith(".") || entry.name === ".assetsignore",
        `Unexpected hidden file: ${path}`,
      );
      return [path];
    });
}

function inventory(directory: string) {
  const entries = files(directory).map((path) => ({
    path: relative(directory, path).replaceAll("\\", "/"),
    bytes: lstatSync(path).size,
    sha256: hash(path),
  }));
  const assets = entries.filter((entry) => !controls.has(entry.path));
  assert(
    assets.length > 0 && assets.length <= maxFiles,
    "Asset count exceeds the Free plan limit.",
  );
  assert(
    assets.every((entry) => entry.bytes <= maxAssetBytes),
    "An asset exceeds 25 MiB.",
  );
  assert(
    entries.some((entry) => entry.path === "index.html"),
    "Missing prerendered homepage.",
  );
  return entries;
}

const config = JSON.parse(readFileSync(configPath, "utf8"));
assert(config.name === "15-stillform", "Unexpected Worker name.");
assert(
  config.assets?.directory === "./output/cloudflare/site",
  "Only the staged site may be uploaded.",
);
assert(config.workers_dev === true, "The free workers.dev address must be enabled.");
assert(!config.main && !config.assets.run_worker_first, "This release must remain static only.");
assert(config.assets.not_found_handling === "none", "Missing files must return 404.");
const wranglerVersion = JSON.parse(
  readFileSync(join(root, "node_modules/wrangler/package.json"), "utf8"),
).version;
const action = process.argv[2];

if (action === "prepare") {
  assert(
    !(await previewIsRunning(config.dev.port)),
    `Stop the Cloudflare preview on port ${config.dev.port} before preparing a new package.`,
  );
  const dist = join(root, "dist");
  const inputs = files(dist, true);
  mkdirSync(output, { recursive: true });
  // Resolve and check the exact target before deleting our generated staging directory.
  assert(realpathSync(output) === output, "Release output must not pass through a symlink.");
  assert(
    resolve(site) === join(root, "output", "cloudflare", "site"),
    "Unexpected staging target.",
  );
  if (existsSync(site)) {
    assert(
      realpathSync(site) === site && !lstatSync(site).isSymbolicLink(),
      "Staging must be a real directory.",
    );
    rmSync(site, { recursive: true });
  }
  mkdirSync(site);
  for (const input of inputs) {
    const destination = join(site, relative(dist, input));
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(input, destination);
  }
  const entries = inventory(site);
  const receipt = {
    schema: 1,
    preparedAt: new Date().toISOString(),
    worker: config.name,
    sourceCommit: git("rev-parse", "HEAD"),
    sourceClean: git("status", "--porcelain", "--untracked-files=all") === "",
    wranglerVersion,
    nodeVersion: Bun.spawnSync(["node", "--version"]).stdout.toString().trim(),
    bunVersion: Bun.version,
    configSha256: hash(configPath),
    assetCount: entries.filter((entry) => !controls.has(entry.path)).length,
    totalBytesIncludingControlFiles: entries.reduce((sum, entry) => sum + entry.bytes, 0),
    files: entries,
  };
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(
    `Prepared ${config.name}: ${receipt.assetCount} assets; receipt: output/cloudflare/receipt.json`,
  );
  if (!receipt.sourceClean)
    console.log("Candidate only: commit the changes, then prepare again before publishing.");
} else if (action === "verify") {
  assert(existsSync(receiptPath), "No release receipt; run cloudflare:prepare.");
  const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
  assert(
    receipt.schema === 1 && receipt.worker === config.name,
    "Receipt belongs to another project or schema.",
  );
  assert(
    receipt.sourceClean,
    "Package was prepared from uncommitted changes; commit and prepare again.",
  );
  assert(
    git("status", "--porcelain", "--untracked-files=all") === "",
    "Working tree changed; commit and prepare again.",
  );
  assert(receipt.sourceCommit === git("rev-parse", "HEAD"), "Commit changed; prepare again.");
  assert(
    receipt.configSha256 === hash(configPath),
    "Deployment configuration changed; prepare again.",
  );
  assert(receipt.wranglerVersion === wranglerVersion, "Wrangler version changed; prepare again.");
  assert(
    JSON.stringify(receipt.files) === JSON.stringify(inventory(site)),
    "Staged assets changed; prepare again.",
  );
  console.log(
    `Verified ${config.name} at ${receipt.sourceCommit.slice(0, 12)}: ${receipt.assetCount} assets match SHA256 receipt.`,
  );
} else {
  throw new Error("Use: bun tools/cloudflare.ts prepare | verify");
}
