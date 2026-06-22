import type { LotLevyStatus } from "@/components/ui/lot"
import type {
  OwnerCorrespondenceMethod,
  OwnerPortalStatus,
  OwnerSummary,
  OwnerType,
} from "@/components/ui/owner"

/** Levy status used on the lot roll in property-detail preview data. */
export type PreviewLotLevyStatus = "current" | "arrears" | "claim-pending"

/** Occupancy classification on the lot roll. */
export type PreviewOccupancyType = "owner-occupier" | "investor"

/**
 * A person within a joint proprietorship. Joint owners share one title entry
 * but may have separate contact details; one person is marked as primary for
 * levy notices and portal invitations.
 */
export interface PreviewOwnerPerson {
  id: string
  name: string
  email?: string
  phone?: string
  /** Receives levy notices, AGM packs, and portal invites for the joint title. */
  isPrimaryContact?: boolean
  /** Serves on committee in their own right (not as the joint entity). */
  committeeRole?: string
}

/** Lot held by a proprietor, with levy and occupancy attached to the lot. */
export interface PreviewOwnerLot {
  lot: number
  unitType: string
  ownerType: PreviewOccupancyType
  tenanted: boolean
  levyStatus: PreviewLotLevyStatus
  arrearsAmount?: number
  entitlementPercent?: number
  unitAddress?: string
}

/**
 * Registered proprietor on the strata roll. Levies attach to lots; owners
 * receive notices and hold portal access. Joint proprietors appear once on
 * title with multiple persons underneath.
 */
export interface PreviewOwner {
  id: string
  propertyId: string
  name: string
  type: OwnerType
  email?: string
  phone?: string
  mailingAddress?: string
  correspondence?: OwnerCorrespondenceMethod
  portalStatus?: OwnerPortalStatus
  lots: PreviewOwnerLot[]
  /** Individual persons when type is joint. */
  persons?: PreviewOwnerPerson[]
  registeredOnRoll?: string
  notes?: string
}

/** Map lot-roll levy status to owner/lot primitive status. */
export function mapPreviewLevyStatus({
  status,
}: {
  status: PreviewLotLevyStatus
}): LotLevyStatus {
  if (status === "arrears") return "overdue"
  if (status === "claim-pending") return "due"
  return "paid"
}

/** Worst-case levy status across all lots held by an owner. */
export function rollupOwnerLevyStatus({
  lots,
}: {
  lots: PreviewOwnerLot[]
}): LotLevyStatus {
  if (lots.some((lot) => lot.levyStatus === "arrears")) return "overdue"
  if (lots.some((lot) => lot.levyStatus === "claim-pending")) return "due"
  if (lots.length === 0) return "not_assessed"
  return "paid"
}

/**
 * Harbour View Towers proprietor directory. Source of truth for owner detail
 * pages; the owners roll tab flattens this to a lot-by-lot view.
 */
export const HARBOUR_VIEW_OWNERS: PreviewOwner[] = [
  {
    id: "own-james-okonkwo",
    propertyId: "harbour-view",
    name: "James Okonkwo",
    type: "individual",
    email: "james@example.com",
    phone: "0411 234 567",
    mailingAddress: "Unit 1, 1-42 Harbour View Drive, Kangaroo Point QLD 4169",
    correspondence: "email",
    portalStatus: "active",
    registeredOnRoll: "14 Mar 2019",
    lots: [
      {
        lot: 1,
        unitType: "2 bed",
        ownerType: "owner-occupier",
        tenanted: false,
        levyStatus: "current",
        entitlementPercent: 2.4,
        unitAddress: "Unit 1",
      },
    ],
    persons: [
      {
        id: "per-james-okonkwo",
        name: "James Okonkwo",
        email: "james@example.com",
        phone: "0411 234 567",
        isPrimaryContact: true,
        committeeRole: "Secretary",
      },
    ],
  },
  {
    id: "own-sarah-patel",
    propertyId: "harbour-view",
    name: "Sarah Patel",
    type: "individual",
    email: "sarah.patel@example.com",
    correspondence: "email",
    portalStatus: "invited",
    mailingAddress: "PO Box 882, South Brisbane QLD 4101",
    registeredOnRoll: "2 Aug 2021",
    lots: [
      {
        lot: 2,
        unitType: "1 bed",
        ownerType: "investor",
        tenanted: true,
        levyStatus: "current",
        entitlementPercent: 2.1,
        unitAddress: "Unit 2",
      },
    ],
  },
  {
    id: "own-chen-wei",
    propertyId: "harbour-view",
    name: "Chen Wei",
    type: "individual",
    phone: "0422 345 678",
    correspondence: "post",
    portalStatus: "not_registered",
    mailingAddress: "Unit 5, 1-42 Harbour View Drive, Kangaroo Point QLD 4169",
    registeredOnRoll: "9 Nov 2020",
    lots: [
      {
        lot: 5,
        unitType: "2 bed",
        ownerType: "owner-occupier",
        tenanted: false,
        levyStatus: "current",
        entitlementPercent: 2.4,
        unitAddress: "Unit 5",
      },
    ],
  },
  {
    id: "own-robert-davis",
    propertyId: "harbour-view",
    name: "Robert Davis",
    type: "individual",
    email: "r.davis@example.com",
    phone: "0433 456 789",
    correspondence: "email",
    portalStatus: "active",
    mailingAddress: "Unit 7, 1-42 Harbour View Drive, Kangaroo Point QLD 4169",
    registeredOnRoll: "6 Jan 2018",
    notes: "Payment plan under review. Do not issue recovery notice without manager approval.",
    lots: [
      {
        lot: 7,
        unitType: "3 bed",
        ownerType: "owner-occupier",
        tenanted: false,
        levyStatus: "arrears",
        arrearsAmount: 8250,
        entitlementPercent: 3.1,
        unitAddress: "Unit 7",
      },
    ],
  },
  {
    id: "own-lisa-wong",
    propertyId: "harbour-view",
    name: "Lisa Wong",
    type: "individual",
    correspondence: "post",
    portalStatus: "not_registered",
    mailingAddress: "C/- Ray White Property Management, Fortitude Valley QLD 4006",
    registeredOnRoll: "22 May 2022",
    lots: [
      {
        lot: 8,
        unitType: "2 bed",
        ownerType: "investor",
        tenanted: true,
        levyStatus: "claim-pending",
        entitlementPercent: 2.4,
        unitAddress: "Unit 8",
      },
    ],
  },
  {
    id: "own-priya-singh",
    propertyId: "harbour-view",
    name: "Priya Singh",
    type: "individual",
    correspondence: "email",
    portalStatus: "not_registered",
    registeredOnRoll: "30 Sep 2023",
    lots: [
      {
        lot: 12,
        unitType: "1 bed",
        ownerType: "investor",
        tenanted: true,
        levyStatus: "current",
        entitlementPercent: 2.1,
        unitAddress: "Unit 12",
      },
    ],
  },
  {
    id: "own-margaret-chen",
    propertyId: "harbour-view",
    name: "Margaret Chen",
    type: "individual",
    email: "m.chen@example.com",
    phone: "0444 567 890",
    correspondence: "portal",
    portalStatus: "active",
    mailingAddress: "Unit 14, 1-42 Harbour View Drive, Kangaroo Point QLD 4169",
    registeredOnRoll: "11 Apr 2017",
    lots: [
      {
        lot: 14,
        unitType: "2 bed",
        ownerType: "owner-occupier",
        tenanted: false,
        levyStatus: "current",
        entitlementPercent: 2.4,
        unitAddress: "Unit 14",
      },
    ],
    persons: [
      {
        id: "per-margaret-chen",
        name: "Margaret Chen",
        email: "m.chen@example.com",
        phone: "0444 567 890",
        isPrimaryContact: true,
        committeeRole: "Member",
      },
    ],
  },
  {
    id: "own-patricia-david-kim",
    propertyId: "harbour-view",
    name: "Patricia & David Kim",
    type: "joint",
    email: "pkim@example.com",
    phone: "0455 678 901",
    correspondence: "email",
    portalStatus: "active",
    mailingAddress: "Unit 18, 1-42 Harbour View Drive, Kangaroo Point QLD 4169",
    registeredOnRoll: "3 Jul 2016",
    lots: [
      {
        lot: 18,
        unitType: "2 bed",
        ownerType: "owner-occupier",
        tenanted: false,
        levyStatus: "current",
        entitlementPercent: 2.4,
        unitAddress: "Unit 18",
      },
    ],
    persons: [
      {
        id: "per-patricia-kim",
        name: "Patricia Kim",
        email: "pkim@example.com",
        phone: "0455 678 901",
        isPrimaryContact: true,
        committeeRole: "Treasurer",
      },
      {
        id: "per-david-kim",
        name: "David Kim",
        email: "david.kim@example.com",
        phone: "0455 678 902",
        isPrimaryContact: false,
      },
    ],
  },
  {
    id: "own-david-park",
    propertyId: "harbour-view",
    name: "David Park",
    type: "individual",
    phone: "0466 789 012",
    correspondence: "email",
    portalStatus: "active",
    mailingAddress: "Unit 22, 1-42 Harbour View Drive, Kangaroo Point QLD 4169",
    registeredOnRoll: "19 Feb 2020",
    lots: [
      {
        lot: 22,
        unitType: "2 bed",
        ownerType: "owner-occupier",
        tenanted: false,
        levyStatus: "current",
        entitlementPercent: 2.4,
        unitAddress: "Unit 22",
      },
    ],
  },
  {
    id: "own-emma-thompson",
    propertyId: "harbour-view",
    name: "Emma Thompson",
    type: "individual",
    email: "e.thompson@example.com",
    correspondence: "email",
    portalStatus: "invited",
    mailingAddress: "C/- LJ Hooker New Farm, Brisbane QLD 4005",
    registeredOnRoll: "8 Dec 2021",
    lots: [
      {
        lot: 23,
        unitType: "1 bed",
        ownerType: "investor",
        tenanted: true,
        levyStatus: "arrears",
        arrearsAmount: 2875,
        entitlementPercent: 2.1,
        unitAddress: "Unit 23",
      },
    ],
  },
  {
    id: "own-thomas-brown",
    propertyId: "harbour-view",
    name: "Thomas Brown",
    type: "individual",
    correspondence: "post",
    portalStatus: "not_registered",
    registeredOnRoll: "27 Oct 2019",
    lots: [
      {
        lot: 27,
        unitType: "2 bed",
        ownerType: "owner-occupier",
        tenanted: false,
        levyStatus: "current",
        entitlementPercent: 2.4,
        unitAddress: "Unit 27",
      },
    ],
    persons: [
      {
        id: "per-thomas-brown",
        name: "Thomas Brown",
        isPrimaryContact: true,
        committeeRole: "Member",
      },
    ],
  },
  {
    id: "own-jennifer-michael-walsh",
    propertyId: "harbour-view",
    name: "Jennifer & Michael Walsh",
    type: "joint",
    email: "j.walsh@example.com",
    phone: "0477 890 123",
    correspondence: "email",
    portalStatus: "active",
    mailingAddress: "Unit 31, 1-42 Harbour View Drive, Kangaroo Point QLD 4169",
    registeredOnRoll: "15 May 2015",
    lots: [
      {
        lot: 31,
        unitType: "2 bed",
        ownerType: "owner-occupier",
        tenanted: false,
        levyStatus: "current",
        entitlementPercent: 2.4,
        unitAddress: "Unit 31",
      },
    ],
    persons: [
      {
        id: "per-jennifer-walsh",
        name: "Jennifer Walsh",
        email: "j.walsh@example.com",
        phone: "0477 890 123",
        isPrimaryContact: true,
        committeeRole: "Chairperson",
      },
      {
        id: "per-michael-walsh",
        name: "Michael Walsh",
        email: "m.walsh@example.com",
        isPrimaryContact: false,
      },
    ],
  },
  {
    id: "own-michael-obrien",
    propertyId: "harbour-view",
    name: "Michael O'Brien",
    type: "individual",
    phone: "0488 901 234",
    correspondence: "post",
    portalStatus: "not_registered",
    mailingAddress: "Unit 38, 1-42 Harbour View Drive, Kangaroo Point QLD 4169",
    registeredOnRoll: "4 Sep 2022",
    lots: [
      {
        lot: 38,
        unitType: "3 bed",
        ownerType: "owner-occupier",
        tenanted: false,
        levyStatus: "arrears",
        arrearsAmount: 1275,
        entitlementPercent: 3.1,
        unitAddress: "Unit 38",
      },
    ],
  },
  {
    id: "own-alicia-nguyen",
    propertyId: "harbour-view",
    name: "Alicia Nguyen",
    type: "individual",
    email: "a.nguyen@investments.com.au",
    correspondence: "email",
    portalStatus: "active",
    mailingAddress: "Level 12, 100 Eagle St, Brisbane QLD 4000",
    registeredOnRoll: "1 Jun 2024",
    lots: [
      {
        lot: 42,
        unitType: "3 bed penthouse",
        ownerType: "investor",
        tenanted: true,
        levyStatus: "current",
        entitlementPercent: 4.2,
        unitAddress: "Penthouse",
      },
    ],
  },
]

/**
 * Look up a proprietor by stable id within a property.
 */
export function getPreviewOwner({
  propertyId,
  ownerId,
}: {
  propertyId: string
  ownerId: string
}): PreviewOwner | undefined {
  return HARBOUR_VIEW_OWNERS.find(
    (owner) => owner.propertyId === propertyId && owner.id === ownerId
  )
}

/**
 * All proprietors for a scheme preview property.
 */
export function getPreviewOwnersForProperty({
  propertyId,
}: {
  propertyId: string
}): PreviewOwner[] {
  return HARBOUR_VIEW_OWNERS.filter((owner) => owner.propertyId === propertyId)
}

/** Lot row on the owners roll: one row per lot with proprietor summary. */
export interface PreviewLotRow {
  lot: number
  unitType: string
  ownerId: string
  ownerName: string
  ownerType: PreviewOccupancyType
  tenanted: boolean
  committee?: string
  levyStatus: PreviewLotLevyStatus
  arrearsAmount?: number
  phone?: string
  email?: string
  entitlementPercent?: number
}

/**
 * Flatten proprietors to lot rows for the owners roll tab.
 */
export function getPreviewLotRowsForProperty({
  propertyId,
}: {
  propertyId: string
}): PreviewLotRow[] {
  return getPreviewOwnersForProperty({ propertyId }).flatMap((owner) =>
    owner.lots.map((lot) => ({
      lot: lot.lot,
      unitType: lot.unitType,
      ownerId: owner.id,
      ownerName: owner.name,
      ownerType: lot.ownerType,
      tenanted: lot.tenanted,
      committee:
        owner.persons?.find((person) => person.committeeRole)?.committeeRole ??
        owner.persons?.find((person) => person.isPrimaryContact)?.committeeRole,
      levyStatus: lot.levyStatus,
      arrearsAmount: lot.arrearsAmount,
      phone: owner.phone,
      email: owner.email,
      entitlementPercent: lot.entitlementPercent,
    }))
  )
}

/**
 * Convert preview proprietor data to OwnerSummary for UI primitives.
 */
export function toOwnerSummary({ owner }: { owner: PreviewOwner }): OwnerSummary {
  return {
    id: owner.id,
    name: owner.name,
    type: owner.type,
    email: owner.email,
    phone: owner.phone,
    mailingAddress: owner.mailingAddress,
    lots: owner.lots.map((lot) => ({
      number: lot.lot,
      unit: lot.unitAddress,
    })),
    levyStatus: rollupOwnerLevyStatus({ lots: owner.lots }),
    portalStatus: owner.portalStatus,
    correspondence: owner.correspondence,
    isCommitteeMember: Boolean(
      owner.persons?.some((person) => person.committeeRole)
    ),
  }
}
