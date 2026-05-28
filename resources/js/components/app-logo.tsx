import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <AppLogoIcon className="h-7 w-7 object-contain" />
            </div>

            <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                    CTECH
                </span>

                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Management System
                </span>
            </div>
        </div>
    );
}