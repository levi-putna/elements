"use client"

import {
  Building2,
  FileText,
  Home,
  User,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { MentionEntityType } from "@/lib/mention-entities"

const MENTION_TYPE_ICONS: Record<string, LucideIcon> = {
  scheme: Building2,
  lot: Home,
  owner: User,
  document: FileText,
}

export interface MentionTagProps {
  label: string
  type: MentionEntityType | string
  className?: string
}

/**
 * Inline mention chip: lime-soft background, forest text, type icon.
 */
export function MentionTag({ label, type, className }: MentionTagProps) {
  const Icon = MENTION_TYPE_ICONS[type] ?? Building2

  return (
    <span
      className={cn(
        "mx-0.5 inline-flex max-w-full align-baseline items-center gap-1 rounded-xs bg-lime-soft px-1.5 py-0.5 text-[0.8125rem] font-medium leading-none text-forest",
        className
      )}
      data-mention-type={type}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </span>
  )
}
