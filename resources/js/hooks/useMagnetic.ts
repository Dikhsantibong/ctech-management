import { useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function useMagnetic(strength = 0.5) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const mouseX = useSpring(x, springConfig);
    const mouseY = useSpring(y, springConfig);

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        
        x.set(middleX * strength);
        y.set(middleY * strength);
        setPosition({ x: middleX * strength, y: middleY * strength });
    };

    const reset = () => {
        x.set(0);
        y.set(0);
        setPosition({ x: 0, y: 0 });
    };

    return { ref, mouseX, mouseY, handleMouse, reset, position };
}
