import { Variants } from "framer-motion";

export const EASING = [0.76, 0, 0.24, 1];

export const fadeUp: Variants = {
    initial: {
        y: 40,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: EASING,
        },
    },
};

export const fadeIn: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: EASING,
        },
    },
};

export const staggerContainer: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const revealLine: Variants = {
    initial: {
        y: "100%",
    },
    animate: {
        y: 0,
        transition: {
            duration: 1,
            ease: [0.76, 0, 0.24, 1],
        },
    },
};

export const scaleUp: Variants = {
    initial: {
        scale: 0.8,
        opacity: 0,
    },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 1.2,
            ease: EASING,
        },
    },
};

export const imageReveal: Variants = {
    initial: {
        clipPath: "inset(100% 0% 0% 0%)",
        scale: 1.1,
    },
    animate: {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        transition: {
            duration: 1.5,
            ease: [0.76, 0, 0.24, 1],
        },
    },
};
