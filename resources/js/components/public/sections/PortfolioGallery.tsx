import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";

const PROJECTS = [
    {
        title: "Fintech Dashboard",
        category: "Enterprise Software",
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    },
    {
        title: "Logistics ERP",
        category: "B2B Platform",
        img: "https://images.unsplash.com/photo-1586528116311-ad8ed7c663be?q=80&w=2070&auto=format&fit=crop",
    },
    {
        title: "E-Commerce Architecture",
        category: "Web Application",
        img: "https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1964&auto=format&fit=crop",
    }
];

export function PortfolioGallery() {
    const containerRef = useRef(null);
    
    return (
        <section id="portfolio" className="py-32 bg-[var(--premium-bg)] overflow-hidden">
            <div className="px-8 md:px-16 w-full max-w-[1920px] mx-auto mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <span className="font-['Space_Grotesk',_monospace] text-sm uppercase tracking-widest text-[var(--premium-gold)] mb-6 block">
                        Selected Works
                    </span>
                    <h2 className="font-['Clash_Display',_sans-serif] text-4xl md:text-7xl font-medium text-[var(--premium-dark)] leading-none">
                        Immersive<br/>Portfolios.
                    </h2>
                </div>
                <Link href="/portfolio">
                    <MagneticButton variant="outline">
                        View All Projects <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
                </Link>
            </div>

            <div className="flex flex-col gap-32 px-8 md:px-16 w-full max-w-[1920px] mx-auto">
                {PROJECTS.map((project, i) => {
                    return <ProjectCard key={i} project={project} index={i} />;
                })}
            </div>
        </section>
    );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <motion.div 
            ref={cardRef}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className={`w-full flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 group cursor-pointer`}
        >
            <div className="w-full md:w-3/5 overflow-hidden rounded-2xl">
                <motion.div style={{ y }} className="w-full h-[50vh] md:h-[80vh] scale-110">
                    <img 
                        src={project.img} 
                        alt={project.title} 
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out" 
                    />
                </motion.div>
            </div>
            <div className="w-full md:w-2/5 flex flex-col">
                <span className="font-['Space_Grotesk',_monospace] text-sm tracking-widest text-gray-500 mb-4 block">
                    {project.category}
                </span>
                <h3 className="font-['Clash_Display',_sans-serif] text-4xl md:text-5xl font-medium text-[var(--premium-dark)] mb-6 group-hover:text-[var(--premium-gold)] transition-colors duration-500">
                    {project.title}
                </h3>
                <div className="w-full h-[1px] bg-gray-200 mt-4 group-hover:bg-[var(--premium-gold)] transition-colors duration-500"></div>
            </div>
        </motion.div>
    );
}
