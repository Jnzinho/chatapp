import { forwardRef, type ButtonHTMLAttributes } from "react"

type Variant = "primary" | "ghost"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: Variant
	fullWidth?: boolean
}

const variantStyles: Record<Variant, string> = {
	primary:
		"rounded-[10px] bg-gradient-to-br from-amber to-amber-deep px-5 py-[11px] text-sm font-semibold text-white shadow-[0_2px_8px_rgba(232,168,56,0.35),0_1px_2px_rgba(232,168,56,0.2)] transition-all duration-180 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(232,168,56,0.4),0_2px_4px_rgba(232,168,56,0.25)] hover:brightness-105 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50",
	ghost:
		"rounded-lg px-4 py-2 text-sm font-semibold text-ink transition-all hover:bg-sidebar-hover hover:text-amber-deep disabled:pointer-events-none disabled:opacity-50",
}

export const Button = forwardRef<HTMLButtonElement, Props>(
	({ variant = "primary", fullWidth, className = "", ...props }, ref) => (
		<button
			ref={ref}
			type={props.type ?? "button"}
			className={`font-sans ${variantStyles[variant]} ${fullWidth ? "w-full" : ""} ${className}`.trim()}
			{...props}
		/>
	),
)

Button.displayName = "Button"
