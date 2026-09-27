import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  type Brief,
  CATEGORIES,
  type Category,
  filterProjects,
  formatBrief,
  nextProject,
  PRIORITIES,
  PROJECT_TYPES,
  PROJECTS,
  type Project,
  SCALES,
  TIMINGS,
  validateBrief,
} from "./content";
import { Flip, gsap, ScrollTrigger, useGSAP, useSiteMotion } from "./motion";

function Arrow({ direction = "diagonal" }: { direction?: "diagonal" | "right" | "left" }) {
  return (
    <svg className={`arrow arrow-${direction}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d={direction === "diagonal" ? "M6 26 26 6H7m19 0v19" : "M4 16h23m-9-9 9 9-9 9"}
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
function Emblem() {
  return (
    <svg viewBox="0 0 36 36" className="emblem" fill="none" aria-hidden="true">
      <path
        d="M3 33V17a15 15 0 0 1 30 0v16M9 33V17a9 9 0 0 1 18 0v16M15 33V17a3 3 0 0 1 6 0v16M3 33h30"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
function useDialog(close: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, []);
  return { ref, onCancel: close };
}

function ProjectDialog({
  initial,
  close,
  motion,
}: {
  initial: Project;
  close: () => void;
  motion: boolean;
}) {
  const [project, setProject] = useState(initial);
  const [detail, setDetail] = useState(false);
  const dialog = useDialog(close);
  useGSAP(
    () => {
      if (motion)
        gsap.from(".study-photo img", {
          opacity: 0,
          scale: 1.03,
          duration: 0.65,
          ease: "power2.out",
        });
    },
    { scope: dialog.ref, dependencies: [project.id], revertOnUpdate: true },
  );
  function change(offset: number) {
    setProject(nextProject(project.id, offset));
    setDetail(false);
  }
  return (
    <dialog
      {...dialog}
      className="study-dialog"
      aria-labelledby="study-title"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          change(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          change(-1);
        }
      }}
    >
      <div className="dialog-toolbar">
        <span>STILLFORM / STUDY {project.number}</span>
        <button type="button" onClick={close} aria-label="Close study">
          Close <span>×</span>
        </button>
      </div>
      <div className="study-layout">
        <div className={`study-photo ${detail ? "detail-view" : ""}`}>
          <img
            src={project.image}
            alt={project.alt}
            style={{ objectPosition: project.position }}
            width="1400"
            height="1400"
          />
          <button
            type="button"
            className="detail-toggle"
            onClick={() => setDetail(!detail)}
            aria-pressed={detail}
          >
            {detail ? "Full composition −" : "Look closer +"}
          </button>
        </div>
        <div className="study-content">
          <span className="eyebrow">{project.category.toUpperCase()} / CONCEPT STUDY</span>
          <h2 id="study-title">{project.title}</h2>
          <p className="study-deck">{project.description}</p>
          <div className="study-rule" />
          <h3>{project.idea}</h3>
          <p>{project.detail}</p>
          <dl>
            <div>
              <dt>Material language</dt>
              <dd>{project.material}</dd>
            </div>
            <div>
              <dt>Study collection</dt>
              <dd>Volume 01 / 2026</dd>
            </div>
          </dl>
          <p className="photo-credit">
            Reference photograph by{" "}
            <a href={project.source} target="_blank" rel="noreferrer">
              {project.author} ↗
            </a>
            . The photographed building is not a Stillform commission.
          </p>
          <div className="study-pagination">
            <button type="button" onClick={() => change(-1)} aria-label="Previous study">
              <Arrow direction="left" />
            </button>
            <span role="status">{project.number} / 04</span>
            <button type="button" onClick={() => change(1)} aria-label="Next study">
              <Arrow direction="right" />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function Projects({ motion, open }: { motion: boolean; open: (project: Project) => void }) {
  const [category, setCategory] = useState<Category>("All");
  const root = useRef<HTMLElement>(null);
  const { contextSafe } = useGSAP({ scope: root });
  const select = contextSafe((next: Category) => {
    if (category === next) return;
    const cards = root.current?.querySelectorAll<HTMLElement>(".project-item");
    const state = Flip.getState(cards ?? []);
    flushSync(() => setCategory(next));
    if (motion)
      Flip.from(state, {
        duration: 0.7,
        ease: "power3.inOut",
        absoluteOnLeave: true,
        scale: true,
        onEnter: (elements) =>
          gsap.fromTo(elements, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    else ScrollTrigger.refresh();
  });
  const count = filterProjects(category).length;
  return (
    <section id="work" className="work section-pad" ref={root} aria-labelledby="work-heading">
      <div className="section-head">
        <span className="eyebrow">01 / A CONSIDERED COLLECTION</span>
        <span className="eyebrow">SELECTED STUDIES, 2026</span>
      </div>
      <div className="work-top">
        <h2 id="work-heading" className="line-reveal">
          Places with <br />a <em>point of view.</em>
        </h2>
        <p>
          A few ways of thinking about space. <br />
          Each one begins with a different question.
        </p>
      </div>
      <div className="filter-bar">
        <fieldset className="filters" aria-label="Filter studies">
          {CATEGORIES.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={category === item}
              onClick={() => select(item)}
            >
              {item}
              <sup>{filterProjects(item).length.toString().padStart(2, "0")}</sup>
            </button>
          ))}
        </fieldset>
        <span className="result-count" role="status">
          {count.toString().padStart(2, "0")} STUDIES
        </span>
      </div>
      <div className={`project-grid ${category !== "All" ? "is-filtered" : ""}`}>
        {PROJECTS.map((project) => (
          <article
            className={`project-item project-${project.id}`}
            key={project.id}
            data-flip-id={project.id}
            hidden={category !== "All" && project.category !== category}
          >
            <button
              type="button"
              className="project-link"
              onClick={() => open(project)}
              aria-label={`View ${project.title}`}
            >
              <div className="project-image reveal-image">
                <img
                  src={project.image}
                  alt={project.alt}
                  loading="lazy"
                  width="1400"
                  height="1600"
                  style={{ objectPosition: project.position }}
                />
                <span className="project-number">{project.number} /</span>
                <span className="project-open">
                  <Arrow />
                </span>
                <span className="view-label">VIEW STUDY</span>
              </div>
              <div className="project-caption">
                <h3>{project.title}</h3>
                <span>{project.category}</span>
              </div>
              <p>{project.place}</p>
            </button>
          </article>
        ))}
      </div>
      <div className="work-note">
        <span>FOUR STUDIES. ONE SHARED SENSIBILITY.</span>
        <p>
          Imagined projects, explored through real architectural photography. <br />
          Photographers and buildings are credited in each study.
        </p>
      </div>
    </section>
  );
}

const steps = [
  {
    number: "01",
    title: "First, we listen.",
    body: "Before a line is drawn, there’s a conversation. How you live. What you value. The small things that make a place feel like yours.",
    note: "PEOPLE BEFORE PLANS",
  },
  {
    number: "02",
    title: "Then, we look closer.",
    body: "At the way the light moves. The feeling of a material. What a place already offers, and what it could become with a little care.",
    note: "CONTEXT BEFORE CONCEPT",
  },
  {
    number: "03",
    title: "We make room for life.",
    body: "Clear ideas become thoughtful spaces. Proportions, details and everyday rituals come together, until everything feels quietly in place.",
    note: "PURPOSE IN EVERY DETAIL",
  },
];
function Approach() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      for (const [index, step] of gsap.utils.toArray<HTMLElement>(".process-step").entries())
        ScrollTrigger.create({
          trigger: step,
          start: "top 65%",
          end: "bottom 65%",
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        });
    },
    { scope: root },
  );
  return (
    <section
      className="approach section-pad"
      id="approach"
      ref={root}
      aria-labelledby="approach-heading"
    >
      <div className="section-head">
        <span className="eyebrow">02 / HOW WE SEE IT</span>
        <span className="eyebrow">GOOD SPACES START WITH GOOD QUESTIONS.</span>
      </div>
      <div className="approach-grid">
        <div className="approach-sticky">
          <h2 id="approach-heading" className="line-reveal">
            Less noise. <br />
            <em>More meaning.</em>
          </h2>
          <div className="process-index" aria-hidden="true">
            <span>{steps[active]?.number}</span>
            <span>/ 03</span>
          </div>
          <svg className="plan-drawing" viewBox="0 0 340 240" fill="none" aria-hidden="true">
            <path
              d="M25 210V35h170v35h110v140H25Zm0-85h80m30 0h60V70m0 90v50m-90 0v-85m90 0h110M25 90h35"
              stroke="currentColor"
            />
            <path
              d="M105 125a30 30 0 0 1 30-30v30M195 160a35 35 0 0 0 35-35h-35"
              stroke="currentColor"
              strokeWidth="0.6"
            />
            <path
              d="M35 45h50v36H35zm205 60h54v80h-54M150 47h32v50h-32"
              stroke="currentColor"
              strokeWidth="0.6"
            />
            <path d="M15 220h300M15 215v10m300-10v10" stroke="currentColor" strokeWidth="0.4" />
            <circle cx="65" cy="174" r="19" stroke="currentColor" strokeWidth="0.6" />
            <path d="M65 152v44m-22-22h44" stroke="currentColor" strokeWidth="0.4" />
          </svg>
          <p className="drawing-caption">THE START OF AN IDEA / CONCEPT SKETCH</p>
        </div>
        <div className="process-steps">
          {steps.map((step, index) => (
            <article
              className={`process-step ${active === index ? "is-current" : ""}`}
              key={step.number}
            >
              <span className="eyebrow">
                {step.number} / {step.note}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <span className="step-line" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChoiceGroup({
  legend,
  name,
  items,
  value,
  set,
}: {
  legend: string;
  name: string;
  items: readonly string[];
  value: string;
  set: (value: string) => void;
}) {
  return (
    <fieldset className="choice-group">
      <legend>{legend}</legend>
      <div>
        {items.map((item) => (
          <label className={value === item ? "choice selected" : "choice"} key={item}>
            <input
              type="radio"
              name={name}
              value={item}
              checked={value === item}
              onChange={() => set(item)}
            />
            <span>{item}</span>
            <span className="choice-check" aria-hidden="true">
              ↗
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
function BriefDialog({
  brief,
  close,
  edit,
}: {
  brief: Brief;
  close: () => void;
  edit: () => void;
}) {
  const dialog = useDialog(close);
  const [downloaded, setDownloaded] = useState(false);
  function download() {
    const url = URL.createObjectURL(
      new Blob([formatBrief(brief)], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "stillform-project-brief.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  return (
    <dialog {...dialog} className="brief-dialog" aria-labelledby="brief-title">
      <div className="dialog-toolbar">
        <span>STILLFORM / YOUR STARTING POINT</span>
        <button type="button" onClick={close} aria-label="Close brief">
          Close <span>×</span>
        </button>
      </div>
      <div className="brief-sheet">
        <Emblem />
        <span className="eyebrow">A CONVERSATION, TAKING SHAPE.</span>
        <h2 id="brief-title">
          A little clarity <br />
          for <em>what comes next.</em>
        </h2>
        <p>This is your local planning note. No enquiry has been sent.</p>
        <dl>
          <div>
            <dt>The space</dt>
            <dd>{brief.type}</dd>
          </div>
          <div>
            <dt>The scale</dt>
            <dd>{brief.scale}</dd>
          </div>
          <div>
            <dt>The timing</dt>
            <dd>{brief.timing}</dd>
          </div>
          <div>
            <dt>What matters</dt>
            <dd>{brief.priorities.join(" · ")}</dd>
          </div>
        </dl>
        <div className="brief-actions">
          <button type="button" className="button button-dark" onClick={download}>
            Keep my brief <Arrow />
          </button>
          <button type="button" className="text-link" onClick={edit}>
            Make a change
          </button>
        </div>
        <p className="brief-status" role="status">
          {downloaded
            ? "Your text-file download is ready. Nothing was submitted."
            : "No personal details, commitments or account needed."}
        </p>
      </div>
    </dialog>
  );
}
function Enquiry() {
  const [brief, setBrief] = useState<Brief>({ type: "", scale: "", timing: "", priorities: [] });
  const [errors, setErrors] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const [priorityNotice, setPriorityNotice] = useState("");
  const errorBox = useRef<HTMLDivElement>(null);
  function set(key: keyof Omit<Brief, "priorities">, value: string) {
    setBrief({ ...brief, [key]: value });
    setErrors([]);
  }
  function priority(value: string) {
    if (brief.priorities.includes(value)) {
      setBrief({ ...brief, priorities: brief.priorities.filter((item) => item !== value) });
      setPriorityNotice("");
    } else if (brief.priorities.length < 3) {
      setBrief({ ...brief, priorities: [...brief.priorities, value] });
      setPriorityNotice("");
    } else setPriorityNotice("Choose up to three priorities. Remove one to make room for another.");
  }
  function review(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validateBrief(brief);
    setErrors(nextErrors);
    if (nextErrors.length) requestAnimationFrame(() => errorBox.current?.focus());
    else setShow(true);
  }
  return (
    <section className="enquiry section-pad" id="project" aria-labelledby="enquiry-heading">
      <div className="section-head">
        <span className="eyebrow">03 / YOUR NEXT CHAPTER</span>
        <span className="eyebrow">EVERY GOOD SPACE STARTS SOMEWHERE.</span>
      </div>
      <div className="enquiry-grid">
        <div className="enquiry-intro">
          <h2 id="enquiry-heading" className="line-reveal">
            Something <br />
            <em>on your mind?</em>
          </h2>
          <p>
            A room that could work harder. A home that could feel more like you. An idea you haven’t
            quite found the words for.
          </p>
          <p>Let’s give it a little shape.</p>
          <div className="enquiry-note">
            <span>↗</span>
            <p>
              Build a short project brief. <br />
              No personal details. Nothing sent.
            </p>
          </div>
        </div>
        <form className="brief-form" onSubmit={review} noValidate>
          <ChoiceGroup
            legend="01 / WHAT ARE YOU IMAGINING?"
            name="space"
            items={PROJECT_TYPES}
            value={brief.type}
            set={(value) => set("type", value)}
          />
          <ChoiceGroup
            legend="02 / HOW MUCH CHANGE?"
            name="scale"
            items={SCALES}
            value={brief.scale}
            set={(value) => set("scale", value)}
          />
          <ChoiceGroup
            legend="03 / WHEN MIGHT IT HAPPEN?"
            name="timing"
            items={TIMINGS}
            value={brief.timing}
            set={(value) => set("timing", value)}
          />
          <fieldset className="priorities">
            <legend>
              04 / WHAT MATTERS MOST? <span>CHOOSE 1–3</span>
            </legend>
            <div>
              {PRIORITIES.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => priority(item)}
                  aria-pressed={brief.priorities.includes(item)}
                >
                  {item}
                  <span>{brief.priorities.includes(item) ? "−" : "+"}</span>
                </button>
              ))}
            </div>
            <p role="status">{priorityNotice}</p>
          </fieldset>
          {errors.length > 0 && (
            <div className="form-errors" ref={errorBox} tabIndex={-1} role="alert">
              <p>A few details to finish:</p>
              <ul>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <button type="submit" className="button button-dark review-brief">
            See my starting point <Arrow />
          </button>
          <p className="form-footnote">
            A local demonstration for a fictional practice. No information leaves this page.
          </p>
        </form>
      </div>
      {show && (
        <BriefDialog brief={brief} close={() => setShow(false)} edit={() => setShow(false)} />
      )}
    </section>
  );
}

function Credits({ close }: { close: () => void }) {
  const dialog = useDialog(close);
  return (
    <dialog {...dialog} className="credits-dialog" aria-labelledby="credits-title">
      <div className="dialog-toolbar">
        <span>THE PEOPLE BEHIND THE PHOTOGRAPHS</span>
        <button type="button" onClick={close} aria-label="Close credits">
          Close <span>×</span>
        </button>
      </div>
      <h2 id="credits-title">
        With <em>thanks.</em>
      </h2>
      <p>
        These real photographs illustrate fictional design studies. Stillform is an imagined
        practice, and does not claim authorship of the buildings shown.
      </p>
      {PROJECTS.map((project) => (
        <div className="credit-row" key={project.id}>
          <span>{project.title}</span>
          <a href={project.source} target="_blank" rel="noreferrer">
            {project.author} <Arrow />
          </a>
        </div>
      ))}
      <p>
        Used under the{" "}
        <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">
          Unsplash License ↗
        </a>
        . Original identity, copy and website design created for this portfolio.
      </p>
    </dialog>
  );
}

export function App() {
  const root = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState(
    () =>
      typeof window === "undefined" ||
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [menu, setMenu] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [credits, setCredits] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useSiteMotion(root, motion);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setMotion(!media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menu]);
  return (
    <div className={`site ${motion ? "motion-on" : "motion-off"}`} ref={root}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <a className="small-brand" href="#main" aria-label="Stillform home">
          <Emblem />
          <span>
            Architecture <br />& interiors
          </span>
        </a>
        <span className="header-note">
          CONSIDERED SPACES. <br />
          LASTING IMPRESSIONS.
        </span>
        <nav
          className={menu ? "main-nav menu-open" : "main-nav"}
          id="navigation"
          aria-label="Main navigation"
        >
          {/* biome-ignore lint/a11y/useValidAnchor: Native section link also closes the mobile navigation. */}
          <a href="#work" onClick={() => setMenu(false)}>
            Selected work <sup>04</sup>
          </a>
          {/* biome-ignore lint/a11y/useValidAnchor: Native section link also closes the mobile navigation. */}
          <a href="#approach" onClick={() => setMenu(false)}>
            Our approach
          </a>
          {/* biome-ignore lint/a11y/useValidAnchor: Native section link also closes the mobile navigation. */}
          <a href="#project" onClick={() => setMenu(false)}>
            Your project <Arrow />
          </a>
        </nav>
        <button
          ref={menuButton}
          type="button"
          className="menu-button"
          aria-controls="navigation"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? "Close" : "Menu"} <span>{menu ? "−" : "+"}</span>
        </button>
      </header>
      <main id="main">
        <section className="hero">
          <h1 className="masthead">STILLFORM</h1>
          <div className="hero-picture">
            <div className="hero-parallax">
              <img
                src="/images/stair-wide.webp"
                srcSet="/images/stair.webp 1400w, /images/stair-wide.webp 2200w"
                sizes="94vw"
                width="2200"
                height="1353"
                alt="Warm timber spiral staircase, seen from above, with rhythmic curved balustrades"
                fetchPriority="high"
              />
            </div>
            <div className="hero-caption">
              <span className="eyebrow">SPACES FOR A SLOWER KIND OF LIVING.</span>
              <h2>
                Quietly <br />
                <em>extraordinary.</em>
              </h2>
              <a href="#work" className="hero-explore">
                Explore the studies <Arrow />
              </a>
            </div>
            <div className="hero-side">
              <span>THE QUIET TURN</span>
              <span>STUDY NO. 02 / 2026</span>
            </div>
          </div>
          <div className="hero-bottom">
            <span>AN INDEPENDENT POINT OF VIEW.</span>
            <span>ARCHITECTURE · INTERIORS · EVERYDAY LIFE</span>
            <a href="#studio">
              TAKE YOUR TIME <span>↓</span>
            </a>
          </div>
        </section>
        <section className="ethos section-pad" id="studio">
          <div className="ethos-kicker">
            <Emblem />
            <span className="eyebrow">THE STILLFORM WAY</span>
          </div>
          <div className="ethos-body">
            <h2 className="line-reveal">
              Not just how a place looks. <br />
              How it makes you <em>feel.</em>
            </h2>
            <div className="ethos-rule" />
            <div className="ethos-copy">
              <span className="eyebrow">A LITTLE LESS. A LITTLE BETTER.</span>
              <p>
                We’re drawn to spaces that don’t need to shout. To honest materials, changing light
                and the small details that make everyday life feel considered.
              </p>
              <p>
                Stillform is an exploration of that idea. A practice imagined around people, place
                and the possibility of doing things a little more thoughtfully.
              </p>
            </div>
          </div>
        </section>
        <Projects motion={motion} open={setProject} />
        <section className="materials section-pad">
          <div className="materials-image reveal-image">
            <img
              src="/images/timber.webp"
              alt="Vertical timber fins create a rhythm of warm surfaces and deep shadow"
              width="1400"
              height="2096"
              loading="lazy"
            />
          </div>
          <div className="materials-copy">
            <span className="eyebrow">IN THE DETAILS / MATERIAL NOTES</span>
            <h2 className="line-reveal">
              Honest materials. <br />
              <em>Nothing to hide.</em>
            </h2>
            <p>
              The grain of timber. The weight of stone. The way a surface changes as the light moves
              across it.
            </p>
            <p>
              We find richness in these quiet things. Materials chosen to be lived with, touched and
              noticed over time.
            </p>
            <a className="text-link" href="#approach">
              A closer look at our thinking <Arrow />
            </a>
            <span className="material-stamp">
              MATERIAL STUDY 04 <br />
              TEXTURE / RHYTHM / SHADOW
            </span>
          </div>
        </section>
        <Approach />
        <Enquiry />
        <section className="closing section-pad">
          <span className="eyebrow">GOOD PLACES. GOOD COMPANY.</span>
          <h2 className="closing-title">
            Make room <br />
            for <em>living.</em>
          </h2>
          <div className="closing-bottom">
            <p>
              Thoughtful spaces begin <br />
              with a little possibility.
            </p>
            <a href="#project" className="closing-link">
              Let’s begin <Arrow />
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer section-pad">
        <div className="footer-top">
          <a href="#main" className="footer-brand">
            STILLFORM
            <Emblem />
          </a>
          <div>
            <a href="#work">Selected work</a>
            <a href="#approach">Our approach</a>
            <a href="#project">Your project</a>
          </div>
          <div>
            <button type="button" onClick={() => setCredits(true)}>
              Photo credits ↗
            </button>
            <button type="button" aria-pressed={motion} onClick={() => setMotion(!motion)}>
              Motion {motion ? "on" : "off"} <span>{motion ? "●" : "○"}</span>
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© STILLFORM 2026</span>
          <p>An independent portfolio concept. Imagined practice, real design thinking.</p>
          <a href="#main">BACK TO TOP ↑</a>
        </div>
      </footer>
      {project && (
        <ProjectDialog initial={project} close={() => setProject(null)} motion={motion} />
      )}
      {credits && <Credits close={() => setCredits(false)} />}
    </div>
  );
}
