import { describe, expect, test } from "bun:test";
import {
  type Brief,
  CATEGORIES,
  filterProjects,
  formatBrief,
  nextProject,
  PROJECTS,
  validateBrief,
} from "../src/content";

const brief: Brief = {
  type: "A home",
  scale: "A complete space",
  timing: "Within a year",
  priorities: ["Natural light", "Honest materials"],
};
describe("project exploration", () => {
  test("each category includes only matching studies", () => {
    expect(filterProjects("All")).toHaveLength(4);
    for (const category of CATEGORIES.slice(1))
      expect(filterProjects(category).every((p) => p.category === category)).toBe(true);
    expect(filterProjects("Interiors")).toHaveLength(2);
  });
  test("gallery wraps both directions and preserves project identity", () => {
    expect(nextProject("courtyard", -1).id).toBe("timber");
    expect(nextProject("timber", 1).id).toBe("courtyard");
    for (const project of PROJECTS)
      expect(nextProject(nextProject(project.id, 1).id, -1).id).toBe(project.id);
    expect(() => nextProject("unknown", 1)).toThrow();
  });
});
describe("local project brief", () => {
  test("valid brief is complete and explicitly unsent", () => {
    expect(validateBrief(brief)).toHaveLength(0);
    expect(formatBrief(brief)).toContain("nothing submitted");
    expect(formatBrief(brief)).toContain("Natural light");
  });
  test("empty or injected selections are rejected", () => {
    expect(validateBrief({ type: "", scale: "", timing: "", priorities: [] })).toHaveLength(4);
    expect(() => formatBrief({ ...brief, type: "Unrecognised" })).toThrow();
    expect(validateBrief({ ...brief, priorities: ["<script>"] })).toHaveLength(1);
  });
  test("priority count is bounded and duplicates cannot pad it", () => {
    expect(validateBrief({ ...brief, priorities: [] })).toHaveLength(1);
    expect(
      validateBrief({ ...brief, priorities: ["Natural light", "Natural light"] }),
    ).toHaveLength(1);
    expect(
      validateBrief({
        ...brief,
        priorities: ["Natural light", "Honest materials", "Everyday comfort", "Room to grow"],
      }),
    ).toHaveLength(1);
  });
});
