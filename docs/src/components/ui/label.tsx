import * as React from "react"

import { cn } from "@/lib/utils"
import { Hint } from "@/components/ui/hint"

interface LabelProps extends React.ComponentProps<"label"> {
  /** Marks the field required: bolds the label and appends a destructive asterisk. */
  required?: boolean
  /** Optional Hint content, shown in a popover beside the label. */
  hint?: React.ReactNode
}

function Label({ className, required, hint, children, ...props }: LabelProps) {
  return (
    <div className="flex w-full items-center justify-between gap-1.5">
      <label
        data-slot="label"
        className={cn(
          "flex items-center gap-1.5 text-sm leading-none text-foreground select-none has-disabled:pointer-events-none has-disabled:opacity-50 peer-disabled:pointer-events-none peer-disabled:opacity-50",
          required && "font-bold",
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint != null && (
        <Hint title={children} required={required}>
          {hint}
        </Hint>
      )}
    </div>
  )
}

export { Label }
export type { LabelProps }
