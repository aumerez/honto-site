"use client";

import DiscoveryFlow from "./DiscoveryFlow";

/**
 * Page shell for /[locale]/opportunity-map. The stateful flow (hero, sections,
 * teaser, contact gate, report) lives in DiscoveryFlow.
 */
export default function OpportunityMapPage() {
  return <DiscoveryFlow />;
}
