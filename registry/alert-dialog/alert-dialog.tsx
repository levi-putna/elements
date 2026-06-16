"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * Root alert dialog container. Unlike Dialog, it cannot be dismissed by clicking
 * the backdrop or pressing Escape — the user must choose an explicit action.
 */
function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

/**
 * Element that opens the alert dialog when activated.
 */
function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

/**
 * Portals alert dialog content into document.body.
 */
function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

/**
 * Semi-transparent backdrop behind the alert dialog panel.
 */
function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

const alertDialogVariants = cva(
  "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-hidden rounded-sm bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  {
    variants: {
      size: {
        default: "sm:max-w-sm",
        sm: "gap-3 sm:max-w-xs",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

/**
 * Centred alert dialog panel. No close control — pair with AlertDialogCancel and
 * AlertDialogAction in the footer so the user always makes a deliberate choice.
 */
function AlertDialogContent({
  className,
  size,
  ...props
}: AlertDialogPrimitive.Popup.Props & VariantProps<typeof alertDialogVariants>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        className={cn(alertDialogVariants({ size }), className)}
        {...props}
      />
    </AlertDialogPortal>
  )
}

/**
 * Groups optional media, title, and description at the top of the alert dialog.
 */
function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

const alertDialogMediaVariants = cva(
  "mb-1 flex size-9 shrink-0 items-center justify-center rounded-sm [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Decorative icon or image block above the title. Use the destructive variant to
 * signal irreversible actions.
 */
function AlertDialogMedia({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertDialogMediaVariants>) {
  return (
    <div
      data-slot="alert-dialog-media"
      aria-hidden="true"
      className={cn(alertDialogMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

/**
 * Accessible alert dialog heading.
 */
function AlertDialogTitle({
  className,
  ...props
}: AlertDialogPrimitive.Title.Props) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

/**
 * Supporting copy below the alert dialog title.
 */
function AlertDialogDescription({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

/**
 * Action row at the bottom of the alert dialog.
 */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Confirms the alert dialog and closes it. Defaults to the primary button;
 * pass variant="destructive" for irreversible actions.
 */
function AlertDialogAction({
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-action"
      render={<Button {...props} />}
    >
      {children}
    </AlertDialogPrimitive.Close>
  )
}

/**
 * Dismisses the alert dialog without taking action.
 */
function AlertDialogCancel({
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      render={<Button variant="outline" {...props} />}
    >
      {children}
    </AlertDialogPrimitive.Close>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
