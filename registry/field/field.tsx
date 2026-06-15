"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset"

import { cn } from "@/lib/utils"
import { Hint } from "@/components/ui/hint"

function Field({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex flex-col gap-5", className)}
      {...props}
    />
  )
}

interface FieldLabelProps extends FieldPrimitive.Label.Props {
  /** Marks the field required: bolds the label and appends a destructive asterisk. */
  required?: boolean
  /** Optional Hint content, shown in a popover beside the label. */
  hint?: React.ReactNode
}

function FieldLabel({
  className,
  required,
  hint,
  children,
  ...props
}: FieldLabelProps) {
  return (
    <div className="flex w-full items-center justify-between gap-1.5">
      <FieldPrimitive.Label
        data-slot="field-label"
        className={cn(
          "flex items-center gap-1.5 text-sm leading-none text-foreground select-none data-disabled:opacity-50",
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
      </FieldPrimitive.Label>
      {hint != null && (
        <Hint title={children} required={required}>
          {hint}
        </Hint>
      )}
    </div>
  )
}

function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({ className, ...props }: FieldPrimitive.Error.Props) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      className={cn("text-sm text-destructive", className)}
      {...props}
    />
  )
}

function FieldSet({ className, ...props }: FieldsetPrimitive.Root.Props) {
  return (
    <FieldsetPrimitive.Root
      data-slot="fieldset"
      className={cn("flex flex-col gap-4 rounded-sm border border-border p-4", className)}
      {...props}
    />
  )
}

interface FieldLegendProps extends FieldsetPrimitive.Legend.Props {
  /** Optional Hint content, shown in a popover beside the legend. */
  hint?: React.ReactNode
}

function FieldLegend({ className, hint, children, ...props }: FieldLegendProps) {
  return (
    <div className="flex w-full items-center justify-between gap-1.5">
      <FieldsetPrimitive.Legend
        data-slot="field-legend"
        className={cn("text-sm font-semibold text-foreground", className)}
        {...props}
      >
        {children}
      </FieldsetPrimitive.Legend>
      {hint != null && <Hint title={children}>{hint}</Hint>}
    </div>
  )
}

export {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
}
export type { FieldLabelProps, FieldLegendProps }
