import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, DrawSVGPlugin);

export function useSiteMotion(root: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useGSAP(
    () => {
      const setProgress = gsap.quickSetter(".reading-progress", "scaleX");
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => setProgress(self.progress),
      });
    },
    { scope: root },
  );
  useGSAP(
    () => {
      if (!enabled) return;
      const media = gsap.matchMedia();
      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const masthead = SplitText.create(".masthead", { type: "chars", mask: "chars" });
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(masthead.chars, { yPercent: 105, duration: 1.15, stagger: 0.045 }, 0)
            .from(".hero-picture", { clipPath: "inset(0 12% 0 12%)", duration: 1.4 }, 0.15)
            .from(".hero-picture img", { scale: 1.16, duration: 1.8 }, 0.15)
            .from(".hero-caption > *", { y: 25, opacity: 0, duration: 0.95, stagger: 0.12 }, 0.65);
          gsap.to(".hero-parallax", {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-picture",
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
          for (const heading of gsap.utils.toArray<HTMLElement>(".line-reveal")) {
            SplitText.create(heading, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit(self) {
                return gsap.from(self.lines, {
                  yPercent: 108,
                  duration: 1.05,
                  stagger: 0.1,
                  ease: "power3.out",
                  scrollTrigger: { trigger: heading, start: "top 90%", once: true },
                });
              },
            });
          }
          for (const frame of gsap.utils.toArray<HTMLElement>(".reveal-image")) {
            gsap.from(frame, {
              clipPath: "inset(10% 0 10% 0)",
              duration: 1.3,
              ease: "power3.out",
              scrollTrigger: { trigger: frame, start: "top 93%", once: true },
            });
          }
          gsap.from(".ethos-rule", {
            scaleX: 0,
            transformOrigin: "left",
            ease: "none",
            scrollTrigger: { trigger: ".ethos", start: "top 70%", end: "bottom 60%", scrub: 0.7 },
          });
          gsap.from(".closing-title", {
            xPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: ".closing",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 0.7,
            },
          });
        },
        root,
      );
      return () => media.revert();
    },
    { scope: root, dependencies: [enabled], revertOnUpdate: true },
  );
}

export { Flip, gsap, ScrollTrigger, useGSAP };
