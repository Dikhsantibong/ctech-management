import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs leading-4 font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-ring/20 focus-visible:ring-[3px] transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-accent text-accent-foreground [a&]:hover:bg-accent/80",
        secondary:
          "border-transparent bg-neutral-soft text-neutral-soft-foreground [a&]:hover:bg-neutral-soft/80",
        destructive:
          "border-transparent bg-danger-soft text-danger-soft-foreground",
        outline:
          "border-border text-secondary-foreground [a&]:hover:bg-muted",
        success: "border-transparent bg-success-soft text-success-soft-foreground",
        warning: "border-transparent bg-warning-soft text-warning-soft-foreground",
        danger: "border-transparent bg-danger-soft text-danger-soft-foreground",
        info: "border-transparent bg-info-soft text-info-soft-foreground",
        neutral: "border-transparent bg-neutral-soft text-neutral-soft-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
