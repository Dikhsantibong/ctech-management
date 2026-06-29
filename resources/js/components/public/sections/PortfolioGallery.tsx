import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";

export function PortfolioGallery({ portfolios = [] }: { portfolios?: any }) {
    const containerRef = useRef(null);
    
    // Gunakan data dari database, tanpa dummy data
    const displayProjects = Array.isArray(portfolios) ? portfolios : (portfolios?.data || []);
    
    return (
        <section id="portfolio" className="py-32 bg-[var(--premium-bg)] overflow-hidden">
            <div className="px-8 md:px-16 w-full max-w-[1920px] mx-auto mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <span className="font-['Space_Grotesk',_monospace] text-sm uppercase tracking-widest text-[var(--premium-gold)] mb-6 block">
                        Karya Pilihan
                    </span>
                    <h2 className="font-['Clash_Display',_sans-serif] text-4xl md:text-7xl font-medium text-[var(--premium-dark)] leading-none">
                        Portfolio<br/>Imersif.
                    </h2>
                </div>
                <Link href="/portfolio">
                    <MagneticButton variant="outline">
                        Lihat Semua Proyek <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-8 md:px-16 w-full max-w-[1920px] mx-auto">
                {displayProjects.length > 0 ? (
                    displayProjects.map((project: any, i: number) => {
                        return <ProjectCard key={project.id || i} project={project} index={i} />;
                    })
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-500 font-['Space_Grotesk',_monospace] tracking-widest uppercase">
                        Belum ada portfolio yang ditambahkan.
                    </div>
                )}
            </div>
        </section>
    );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
    const cardRef = useRef(null);

    return (
        <motion.div 
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: (index % 3) * 0.15, ease: [0.76, 0, 0.24, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="w-full flex flex-col group cursor-pointer"
        >
            <div className="w-full aspect-[4/3] overflow-hidden rounded-2xl mb-6 relative">
                <div className="absolute inset-0 bg-[var(--premium-dark)]/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                    src={project.image ? (project.image.startsWith('http') ? project.image : `/storage/${project.image}`) : ''} 
                    alt={project.title} 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out" 
                />
            </div>
            <div className="flex flex-col flex-grow">
                <span className="font-['Space_Grotesk',_monospace] text-xs tracking-widest text-gray-500 mb-3 block uppercase">
                    {project.category}
                </span>
                <h3 className="font-['Clash_Display',_sans-serif] text-2xl md:text-3xl font-medium text-[var(--premium-dark)] mb-4 group-hover:text-[var(--premium-gold)] transition-colors duration-500 line-clamp-2">
                    {project.title}
                </h3>
                <div className="w-full h-[1px] bg-gray-200 mt-auto group-hover:bg-[var(--premium-gold)] transition-colors duration-500"></div>
            </div>
        </motion.div>
    );
}
