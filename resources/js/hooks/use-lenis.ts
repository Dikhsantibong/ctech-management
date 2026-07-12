import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Smooth-scroll untuk halaman public. Satu instance per halaman,
 * otomatis dibersihkan saat unmount.
 */
export function useLenis() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            lerp: 0.1,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        let rafId = 0;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);
}
