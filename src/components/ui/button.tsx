import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "~/components/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium  focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-menu-light text-text-normal dark:shadow-dark-menu-dark shadow shadow-menu-dark hover:bg-menu-hover dark:bg-dark-menu-light dark:text-dark-text-normal dark:hover:bg-dark-menu-hover",
                accent: "bg-accent-main text-dark-text-normal shadow shadow-menu-dark hover:bg-accent-dark dark:bg-dark-accent-main dark:text-dark-text-normal dark:shadow-dark-menu-dark dark:hover:bg-dark-accent-dark",
                destructive:
                    "bg-red-500 text-zinc-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90",
                ghost: "hover:bg-menu-hover dark:hover:bg-dark-menu-hover",
                link: "text-text-normal underline-offset-4 hover:underline dark:text-dark-text-normal",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-10 px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

export { Button, buttonVariants };
