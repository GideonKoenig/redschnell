import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-accent/50 focus-visible:ring-[3px]",
    {
        variants: {
            variant: {
                default:
                    "bg-bg-surface text-text shadow shadow-border hover:bg-bg-muted",
                destructive: "bg-error text-white hover:bg-error/90",
                outline: "border border-border bg-bg-surface hover:bg-bg-muted",
                secondary: "bg-bg-muted text-text hover:bg-bg-muted/80",
                ghost: "hover:bg-bg-muted",
                link: "text-text underline-offset-4 hover:underline",
                accent: "bg-accent text-white hover:bg-accent-hover",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

const Button = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> &
        VariantProps<typeof buttonVariants> & {
            asChild?: boolean;
        }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            ref={ref}
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
});
Button.displayName = "Button";

export { Button, buttonVariants };
