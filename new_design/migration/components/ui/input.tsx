import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-primary disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
