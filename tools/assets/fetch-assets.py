"""Reproduce the selected public, licensed Unsplash image representations."""
from pathlib import Path
import hashlib
import json
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
ASSETS = [
    ("courtyard", "1613977257365-aaae5a9817ff", 1920, "John Fornander", "white-concrete-building-with-swimming-pool-y3_AHHrxUBY"),
    ("stair", "1672929280680-1afde30f94b8", 1400, "Jorgen Hendriksen", "a-wooden-spiral-staircase-with-a-skylight-in-the-background-hCBjuXFjMIM"),
    ("stair-wide", "1672929280680-1afde30f94b8", 2200, "Jorgen Hendriksen", "a-wooden-spiral-staircase-with-a-skylight-in-the-background-hCBjuXFjMIM"),
    ("timber", "1764869024302-a344a7046be6", 1400, "Norbert Kowalczyk", "modern-building-facade-with-vertical-wooden-slats-oGS75Xk28HA"),
    ("gallery", "1777987956542-1edd0c7488d9", 1600, "Fer Troulik", "empty-room-with-large-windows-and-wooden-bench-F985EJTGrxA"),
]
entries = []
for name, photo, width, author, page in ASSETS:
    url = f"https://images.unsplash.com/photo-{photo}?auto=format&fit=max&w={width}&q=85&fm=webp"
    target = ROOT / "public" / "images" / f"{name}.webp"
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.exists():
        request = urllib.request.Request(url, headers={"User-Agent": "Stillform-Portfolio-Assets/1.0"})
        with urllib.request.urlopen(request, timeout=40) as response:
            target.write_bytes(response.read())
    data = target.read_bytes()
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise RuntimeError(f"Invalid WebP asset: {target}")
    entries.append({"id": name, "author": author, "source": f"https://unsplash.com/photos/{page}", "download": url, "license": "Unsplash License", "licenseUrl": "https://unsplash.com/license", "retrieved": "2026-09-27", "representation": "Selected-resolution CDN WebP; not an archival full-resolution original", "processing": "Unsplash CDN width limit and WebP q85; browser crop/colour styling only", "output": f"public/images/{name}.webp", "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()})
(ROOT / "assets.manifest.json").write_text(json.dumps({"schemaVersion": 1, "assets": entries}, indent=2)+"\n", encoding="utf-8")
print(f"Verified {len(entries)} local WebP files; {sum(e['bytes'] for e in entries):,} bytes")
