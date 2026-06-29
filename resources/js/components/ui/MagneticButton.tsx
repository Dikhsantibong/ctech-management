import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: "primary" | "outline" | "ghost";
}

export function MagneticButton({ children, className, onClick, variant = "primary" }: MagneticButtonProps) {
    const { ref, mouseX, mouseY, handleMouse, reset } = useMagnetic(0.2);

    const baseStyles = "relative inline-flex items-center justify-center px-8 py-4 font-['Space_Grotesk',_monospace] text-sm font-bold uppercase tracking-widest overflow-hidden rounded-full transition-colors duration-500 group";
    
    const variants = {
        primary: "bg-[var(--premium-dark)] text-white hover:bg-[var(--premium-text)]",
        outline: "border border-[var(--premium-dark)] text-[var(--premium-dark)] hover:bg-[var(--premium-dark)] hover:text-white",
        ghost: "text-[var(--premium-dark)] hover:text-blue-600",
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onClick={onClick}
            style={{ x: mouseX, y: mouseY }}
            className={cn(baseStyles, variants[variant], className)}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
            {variant === "primary" && (
                <div className="absolute inset-0 z-0 bg-[var(--premium-gold)] translate-y-[100%] rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
            )}
        </motion.button>
    );
}
