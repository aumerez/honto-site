import "@testing-library/jest-dom/vitest";

/* Mock IntersectionObserver for jsdom */
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver;

/* Mock scrollIntoView for jsdom */
Element.prototype.scrollIntoView = () => {};
