import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
export const buttonVariants = cva("", { variants: { variant: { default: "inline-flex items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-white", clinic: "" } }, defaultVariants: { variant: "clinic" } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, asChild = false, ...props }, ref) => { const Comp = asChild ? Slot : "button"; return <Comp className={cn(buttonVariants({ variant }), className)} ref={ref} {...props} />; });
Button.displayName = "Button";
