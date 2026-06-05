/**
 * Redis cache key builders.
 * All keys follow the pattern: `domain:qualifier:id`
 */
export const CacheKeys = {
  // ── Templates ───────────────────────────────────────────────────────────
  templatesList: () => "template:list",
  templateById: (id: string) => `template:id:${id}`,

  // ── Presentations ───────────────────────────────────────────────────────
  presentationById: (id: string) => `presentation:id:${id}`,
  presentationListByOwner: (ownerId: string) => `presentation:owner:${ownerId}`,
  presentationByJoinCode: (joinCode: string) => `presentation:joinCode:${joinCode}`,

  // ── Sessions ────────────────────────────────────────────────────────────
  sessionByPresentationId: (presentationId: string) => `session:pres:${presentationId}`,
  sessionData: (presentationId: string) => `session:data:${presentationId}`,

  // ── Slides ──────────────────────────────────────────────────────────────
  slidesByPresentationId: (presentationId: string) => `slides:pres:${presentationId}`,
  slideById: (presentationId: string, slideId: string) =>
    `slide:${presentationId}:${slideId}`,

  // ── Poll results ────────────────────────────────────────────────────────
  pollResultsBySlide: (slideId: string) => `poll:slide:${slideId}`,
} as const;
