import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

import { HeroShaderCanvas } from '@/components/public/HeroShaderCanvas';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0 font-body">
            <div className="relative hidden h-full flex-col bg-[#0d0d0d] p-10 text-white lg:flex border-r border-[#222] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <HeroShaderCanvas />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/40 via-transparent to-[#0d0d0d]"></div>
                </div>
                <div className="relative z-20 flex flex-col h-full">
                    <Link
                        href={home()}
                        className="flex items-center text-lg font-semibold"
                    >
                        <AppLogoIcon className="mr-2 size-10 fill-current text-[var(--premium-gold,white)]" />
                        <span className="text-2xl font-display">{name}</span>
                    </Link>
                    <div className="flex-1"></div>
                    <div className="mt-auto flex flex-col gap-8 pb-4">
                        <blockquote className="space-y-4 max-w-lg">
                            <p className="text-xl md:text-2xl font-display text-white/90 leading-relaxed font-light italic">
                                "Inovasi sejati bukan hanya tentang menciptakan teknologi baru, melainkan tentang bagaimana teknologi tersebut membentuk ulang cara dunia memandang sebuah keindahan dan efisiensi."
                            </p>
                            <footer className="flex flex-col text-sm text-white/80">
                                <span className="font-semibold text-[var(--premium-gold,white)] tracking-wide text-base">Dikhsan Dwirangga Tibong</span>
                                <span className="font-light opacity-75">Direktur Utama</span>
                            </footer>
                        </blockquote>
                        <div className="text-white/40 tracking-widest uppercase text-[10px]">
                            © {new Date().getFullYear()} {name}. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
