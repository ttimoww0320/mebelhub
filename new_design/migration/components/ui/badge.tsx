import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary border-primary/30",
        secondary:
          "bg-secondary text-secondary-foreground border-border",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/30",
        outline:
          "border-border text-muted-foreground [a]:hover:text-primary [a]:hover:border-primary/50",
        ghost:
          "text-muted-foreground hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline normal-case tracking-normal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
