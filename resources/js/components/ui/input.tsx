import * as React from "react"

import { cn } from "@/lib/utils"

/** Kelas dasar field form (design.md §20, disabled §36): tinggi 40px, surface, border --input, focus ring primary halus. */
export const fieldClasses =
  "w-full rounded-md border border-input bg-card px-3 text-sm text-foreground transition-[color,border-color,box-shadow] duration-150 outline-none placeholder:text-placeholder focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/15 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15 disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-neutral-soft disabled:text-placeholder"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        fieldClasses,
        "flex h-10 py-2 file:mr-3 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
