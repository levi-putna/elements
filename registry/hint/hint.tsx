"use client"

import * as React from "react"
import { CircleHelp } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface HintProps
  extends Omit<React.ComponentProps<typeof PopoverContent>, "title"> {
  /** Optional heading shown at the top of the popover. */
  title?: React.ReactNode
  /** When true, surfaces a "Required" note in the popover header. */
  required?: boolean
  /** Accessible label for the trigger button. */
  label?: string
  /** Popover body content. */
  children?: React.ReactNode
}

/**
 * A small blue question icon that reveals supporting detail in a popover.
 * Sits to the right of a Label or FieldLabel; optional everywhere it appears.
 */
function Hint({
  title,
  required,
  label = "More info",
  className,
  children,
  ...props
}: HintProps) {
  return (
    <Popover>
      <PopoverTrigger
        data-slot="hint-trigger"
        aria-label={label}
        className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-info outline-none transition-colors hover:text-info/80 focus-visible:ring-3 focus-visible:ring-info/30 [&_svg]:size-4"
      >
        <CircleHelp />
      </PopoverTrigger>
      <PopoverContent
        data-slot="hint-content"
        className={cn("space-y-1.5", className)}
        {...props}
      >
        {(title || required) && (
          <div className="flex items-center justify-between gap-2">
            {title ? (
              <span className="text-sm font-semibold text-foreground">
                {title}
              </span>
            ) : (
              <span />
            )}
            {required && (
              <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-destructive uppercase">
                Required
              </span>
            )}
          </div>
        )}
        <div className="text-sm text-muted-foreground">{children}</div>
      </PopoverContent>
    </Popover>
  )
}

export { Hint }
export type { HintProps }
