"use client"

import * as React from "react"
import { OTPFieldPreview as OTPFieldPrimitive } from "@base-ui/react/otp-field"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function InputOTPSlot({
  className,
  ...props
}: OTPFieldPrimitive.Input.Props) {
  return (
    <OTPFieldPrimitive.Input
      data-slot="input-otp-slot"
      className={cn(
        "size-9 rounded-sm border border-input bg-transparent text-center text-base shadow-xs transition-all outline-none focus-visible:z-10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn("flex items-center text-muted-foreground", className)}
      {...props}
    >
      <MinusIcon className="size-4" />
    </div>
  )
}

interface InputOTPProps
  extends Omit<OTPFieldPrimitive.Root.Props, "length"> {
  /** Number of character slots. */
  length?: number
  /** Optional slot grouping, e.g. [3, 3] renders two groups split by a separator. */
  groupSizes?: number[]
}

/**
 * One-time-password input built on Base UI's OTP Field. Renders `length` slots,
 * optionally split into groups with a separator between them.
 */
function InputOTP({
  length = 6,
  groupSizes,
  className,
  children,
  ...props
}: InputOTPProps) {
  const groups = groupSizes ?? [length]
  let slotIndex = 0

  return (
    <OTPFieldPrimitive.Root
      length={length}
      data-slot="input-otp"
      className={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children ??
        groups.map((size, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <InputOTPSeparator />}
            <div className="flex items-center gap-2">
              {Array.from({ length: size }).map(() => (
                <InputOTPSlot key={slotIndex++} />
              ))}
            </div>
          </React.Fragment>
        ))}
    </OTPFieldPrimitive.Root>
  )
}

export { InputOTP, InputOTPSlot, InputOTPSeparator }
export type { InputOTPProps }
