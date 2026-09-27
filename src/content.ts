export const CATEGORIES = ["All", "Residential", "Interiors", "Cultural"] as const;
export type Category = (typeof CATEGORIES)[number];
export const PROJECTS = [
  {
    id: "courtyard",
    number: "01",
    title: "A slower summer",
    category: "Residential",
    place: "Light, water & open thresholds",
    image: "/images/courtyard.webp",
    alt: "White contemporary house with glass doors, a shaded terrace and a turquoise swimming pool",
    author: "John Fornander",
    source: "https://unsplash.com/photos/white-concrete-building-with-swimming-pool-y3_AHHrxUBY",
    material: "Stone / water / white plaster",
    description:
      "A study in the spaces between inside and out. Deep shade, open thresholds and the quiet rhythm of water suggest a home that follows the day instead of rushing through it.",
    idea: "Let the outside set the pace.",
    detail:
      "The relationship between a sheltered terrace and an open pool creates a sequence of retreat and release. Our fictional brief explores that transition through natural light, generous openings and a pared-back material palette.",
    position: "50% 66%",
  },
  {
    id: "stair",
    number: "02",
    title: "The quiet turn",
    category: "Interiors",
    place: "A material-led interior study",
    image: "/images/stair.webp",
    alt: "Looking down a warm wooden spiral staircase with layered curved balustrades",
    author: "Jorgen Hendriksen",
    source:
      "https://unsplash.com/photos/a-wooden-spiral-staircase-with-a-skylight-in-the-background-hCBjuXFjMIM",
    material: "Timber / rhythm / natural light",
    description:
      "An ordinary journey, made extraordinary. This study looks at how repetition, proportion and the warmth of timber can turn movement through a building into a moment worth noticing.",
    idea: "Make the everyday feel considered.",
    detail:
      "The photograph is a real stair in Groningen. It anchors a fictional design exercise about circulation: a continuous handrail, a legible route and a changing view that rewards slowing down.",
    position: "50% 50%",
  },
  {
    id: "gallery",
    number: "03",
    title: "Room for a pause",
    category: "Cultural",
    place: "An exercise in light & gathering",
    image: "/images/gallery.webp",
    alt: "Sunlight through large industrial windows falls across a concrete floor and a single wooden bench",
    author: "Fer Troulik",
    source:
      "https://unsplash.com/photos/empty-room-with-large-windows-and-wooden-bench-F985EJTGrxA",
    material: "Concrete / steel / afternoon light",
    description:
      "Sometimes the strongest gesture is to leave room. A generous volume, a place to sit and the changing geometry of daylight become the starting points for a quieter kind of public space.",
    idea: "Leave space for life to happen.",
    detail:
      "This photograph shows Fenix Museum in Rotterdam, not a Stillform commission. Our concept study uses it to consider how a single material intervention can make a large existing space feel welcoming without erasing its character.",
    position: "50% 57%",
  },
  {
    id: "timber",
    number: "04",
    title: "Between the lines",
    category: "Interiors",
    place: "Texture, repetition & material depth",
    image: "/images/timber.webp",
    alt: "Close view of a dark timber facade with vertical fins, shadow gaps and glimpses of glazing",
    author: "Norbert Kowalczyk",
    source:
      "https://unsplash.com/photos/modern-building-facade-with-vertical-wooden-slats-oGS75Xk28HA",
    material: "Timber / shadow / repetition",
    description:
      "A material story told in small differences. Closely spaced fins catch light and cast shadow, revealing how depth and rhythm can make a simple surface feel rich without making it loud.",
    idea: "Find richness in restraint.",
    detail:
      "A photograph of a facade in Wrocław is the reference for this fictional material study. The exercise considers what its rhythm could bring to an interior screen: privacy, filtered light and an honest expression of the material.",
    position: "50% 50%",
  },
] as const;
export type Project = (typeof PROJECTS)[number];
export function filterProjects(category: Category) {
  return PROJECTS.filter((project) => category === "All" || project.category === category);
}
export function nextProject(id: string, offset: number) {
  const index = PROJECTS.findIndex((project) => project.id === id);
  if (index < 0 || !Number.isInteger(offset))
    throw new RangeError("Unknown project or invalid step");
  return (
    PROJECTS[(((index + offset) % PROJECTS.length) + PROJECTS.length) % PROJECTS.length] ??
    PROJECTS[0]
  );
}

export const PROJECT_TYPES = ["A home", "An interior", "A place to gather"] as const;
export const SCALES = ["One considered room", "A complete space", "A new beginning"] as const;
export const TIMINGS = ["Just exploring", "Within a year", "Ready to begin"] as const;
export const PRIORITIES = [
  "Natural light",
  "Everyday comfort",
  "Honest materials",
  "A closer link to nature",
  "Room to grow",
  "A quieter footprint",
] as const;
export type Brief = { type: string; scale: string; timing: string; priorities: string[] };
export function validateBrief(brief: Brief) {
  const errors: string[] = [];
  if (!(PROJECT_TYPES as readonly string[]).includes(brief.type))
    errors.push("Choose the kind of space you have in mind.");
  if (!(SCALES as readonly string[]).includes(brief.scale)) errors.push("Choose a project scale.");
  if (!(TIMINGS as readonly string[]).includes(brief.timing))
    errors.push("Choose a possible timing.");
  if (
    brief.priorities.length < 1 ||
    brief.priorities.length > 3 ||
    new Set(brief.priorities).size !== brief.priorities.length ||
    brief.priorities.some((item) => !(PRIORITIES as readonly string[]).includes(item))
  )
    errors.push("Choose between one and three different priorities.");
  return errors;
}
export function formatBrief(brief: Brief) {
  const errors = validateBrief(brief);
  if (errors.length) throw new Error(errors.join(" "));
  return [
    "STILLFORM — A starting point",
    "Fictional portfolio concept / local brief / nothing submitted",
    "",
    `Space: ${brief.type}`,
    `Scale: ${brief.scale}`,
    `Timing: ${brief.timing}`,
    "",
    "What matters:",
    ...brief.priorities.map((item) => `- ${item}`),
    "",
    "Next conversation: how you live, what you value and how the place should feel.",
    "This is a personal planning note, not an architectural appointment, quotation or real enquiry.",
  ].join("\n");
}
