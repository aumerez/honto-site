"use client";

import { useEffect, useRef } from "react";

export function useScrollRevealMultiple(
  threshold = 0.1,
  staggerMs = 100
): React.RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(children).indexOf(entry.target as Element);
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * staggerMs);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [threshold, staggerMs]);

  return containerRef;
}
