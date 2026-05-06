import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[120px] w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-primary disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
