import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@inertiajs/react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Grid portfolio (dipakai di halaman /portfolio).
 * Data selalu dari database — tanpa dummy.
 */
export function PortfolioGallery({ portfolios = [] }: { portfolios?: any }) {
    const displayProjects: any[] = Array.isArray(portfolios) ? portfolios : portfolios?.data || [];

    return (
        <section id="portfolio" className="py-24 md:py-32 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 px-6 md:px-12 w-full max-w-[1400px] mx-auto">
                {displayProjects.length > 0 ? (
                    displayProjects.map((project: any, i: number) => (
                        <ProjectCard key={project.id || i} project={project} index={i} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-400 font-body tracking-[0.2em] uppercase text-sm border border-dashed border-gray-200 rounded-3xl">
                        Belum ada portfolio yang ditambahkan.
                    </div>
                )}
            </div>
        </section>
    );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
    const img = project.image
        ? project.image.startsWith("http")
            ? project.image
            : `/storage/${project.image}`
        : null;

    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: (index % 3) * 0.15, ease: EASE }}
            viewport={{ once: true, margin: "-50px" }}
            className="w-full flex flex-col group"
        >
            <Link href={`/portfolio/${project.id}`} className="flex flex-col h-full w-full">
                <div className="w-full aspect-[4/3] overflow-hidden rounded-2xl mb-6 relative bg-gray-100">
                    {img ? (
                        <img
                            src={img}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-body text-xs uppercase tracking-widest text-gray-400">
                            Tanpa Gambar
                        </div>
                    )}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        <ArrowUpRight className="w-4 h-4 text-[#0d0d0d]" />
                    </div>
                </div>
                <div className="flex flex-col flex-grow">
                    <span className="font-body text-xs uppercase tracking-[0.2em] text-[var(--premium-gold)] mb-3 block font-medium">
                        {project.category || "Proyek"}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-[#0d0d0d] mb-5 group-hover:text-[var(--premium-gold)] transition-colors duration-500 line-clamp-2">
                        {project.title}
                    </h3>
                    <div className="w-full h-px bg-gray-200 mt-auto group-hover:bg-[var(--premium-gold)] transition-colors duration-500"></div>
                </div>
            </Link>
        </motion.article>
    );
}
