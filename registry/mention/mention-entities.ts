/**
 * Hard-coded strata entities for mention suggestions in the assistant prompt.
 */

export type MentionEntityType = "scheme" | "lot" | "owner" | "document"

export interface MentionEntity {
  id: string
  label: string
  type: MentionEntityType
  /** Optional subtitle shown in the suggestion list. */
  subtitle?: string
  /** Linked scheme id for prioritising @ suggestions after a # scheme mention. */
  schemeId?: string
}

/** Demo schemes available via # mentions. */
export const MENTION_SCHEMES: MentionEntity[] = [
  {
    id: "SP1042",
    label: "Harbour View Towers",
    type: "scheme",
    subtitle: "SP 1042 · 42 lots",
  },
  {
    id: "SP4821",
    label: "Northbridge Estate",
    type: "scheme",
    subtitle: "SP 4821 · 38 lots",
  },
  {
    id: "SP12045",
    label: "Sunset Gardens",
    type: "scheme",
    subtitle: "SP 12045 · 24 lots",
  },
  {
    id: "SP2287",
    label: "Parkside Residences",
    type: "scheme",
    subtitle: "SP 2287 · 16 lots",
  },
]

/** Lots, owners, and documents available via @ mentions. */
export const MENTION_ENTITIES: MentionEntity[] = [
  {
    id: "HV14",
    label: "Lot 14",
    type: "lot",
    subtitle: "Harbour View Towers · Levy due",
    schemeId: "SP1042",
  },
  {
    id: "SG08",
    label: "Lot 8",
    type: "lot",
    subtitle: "Sunset Gardens · Owner occupied",
    schemeId: "SP12045",
  },
  {
    id: "NE07",
    label: "Lot 7",
    type: "lot",
    subtitle: "Northbridge Estate · Payment plan",
    schemeId: "SP4821",
  },
  {
    id: "MC001",
    label: "Margaret Chen",
    type: "owner",
    subtitle: "Lot 14 · Owner",
    schemeId: "SP1042",
  },
  {
    id: "JO022",
    label: "James Okonkwo",
    type: "owner",
    subtitle: "Lot 22 · Committee secretary",
    schemeId: "SP2287",
  },
  {
    id: "AGM2025-HV",
    label: "AGM 2025 minutes",
    type: "document",
    subtitle: "Harbour View Towers · PDF",
    schemeId: "SP1042",
  },
  {
    id: "LEVY14",
    label: "Levy notice · Lot 14",
    type: "document",
    subtitle: "Issued 12 Mar 2025",
    schemeId: "SP1042",
  },
]

/**
 * Filters scheme entities for # mention suggestions.
 */
export function searchSchemeMentions({
  query,
}: {
  query: string
}): MentionEntity[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return MENTION_SCHEMES

  return MENTION_SCHEMES.filter((entity) => {
    const haystack = [entity.label, entity.id, entity.subtitle]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
    return haystack.includes(needle)
  })
}

/**
 * Filters @ mention entities, prioritising items linked to mentioned schemes.
 */
export function searchEntityMentions({
  query,
  schemeIds = [],
}: {
  query: string
  schemeIds?: string[]
}): MentionEntity[] {
  const needle = query.trim().toLowerCase()
  const matches = (entity: MentionEntity) => {
    if (!needle) return true
    const haystack = [entity.label, entity.id, entity.subtitle, entity.type]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
    return haystack.includes(needle)
  }

  const related = MENTION_ENTITIES.filter(
    (entity) => entity.schemeId && schemeIds.includes(entity.schemeId) && matches(entity)
  )
  const unrelated = MENTION_ENTITIES.filter(
    (entity) => !entity.schemeId || !schemeIds.includes(entity.schemeId)
  ).filter(matches)

  return [...related, ...unrelated]
}
