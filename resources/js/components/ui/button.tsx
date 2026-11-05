import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-150 disabled:pointer-events-none disabled:border-disabled-border disabled:bg-neutral-soft disabled:text-placeholder [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[#004EEB] dark:hover:bg-primary/90 focus-visible:ring-primary/25",
        destructive:
          "bg-destructive text-white hover:bg-[#D92D20] focus-visible:ring-destructive/20",
        outline:
          "border border-input bg-card text-secondary-foreground hover:bg-muted hover:text-foreground focus-visible:border-ring",
        secondary:
          "border border-input bg-card text-secondary-foreground hover:bg-muted hover:text-foreground focus-visible:border-ring",
        ghost: "text-subtle-foreground hover:bg-muted hover:text-foreground disabled:bg-transparent",
        link: "h-auto px-0 text-primary underline-offset-4 hover:underline disabled:bg-transparent",
      },
      size: {
        default: "h-10 px-4 has-[>svg]:px-3.5",
        sm: "h-8 px-3 text-[13px] has-[>svg]:px-2.5",
        lg: "h-11 px-5 has-[>svg]:px-4",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
