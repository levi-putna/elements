"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const switchVariants = cva(
  "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[unchecked]:bg-input dark:data-[unchecked]:bg-input/80",
  {
    variants: {
      variant: {
        // Lime active track: the standard on/off toggle.
        default:
          "focus-visible:border-ring focus-visible:ring-ring/50 data-[checked]:bg-primary",
        // Red active track: for destructive or dangerous toggles.
        destructive:
          "focus-visible:border-destructive focus-visible:ring-destructive/30 data-[checked]:bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Switch({
  className,
  variant,
  ...props
}: SwitchPrimitive.Root.Props & VariantProps<typeof switchVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ variant }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4 translate-x-0.5 rounded-full bg-background shadow-sm ring-0 transition-transform data-[checked]:translate-x-[1.125rem] data-disabled:bg-muted-foreground/40"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch, switchVariants }
