import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
                <div className="absolute inset-0 bg-[url('/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDBIMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-20" />
                <div className="relative z-20 flex flex-col h-full">
                    <Link
                        href={home()}
                        className="flex items-center text-lg font-semibold"
                    >
                        <AppLogoIcon className="mr-2 size-10 fill-current text-white" />
                        <span className="text-2xl">{name}</span>
                    </Link>
                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 mt-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold leading-tight">
                                Welcome Back
                            </h2>
                            <p className="text-lg text-blue-100 max-w-md">
                                Manage your projects, track tasks, and streamline your workflow with our powerful management platform.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <div className="text-3xl font-bold">24/7</div>
                                <div className="text-sm text-blue-100">Support</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <div className="text-3xl font-bold">100%</div>
                                <div className="text-sm text-blue-100">Secure</div>
                            </div>
                        </div>
                    </div>
                    <div className="text-sm text-blue-200">
                        © 2026 {name}. All rights reserved.
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
