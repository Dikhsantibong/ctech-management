import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <AppLogoIcon className="h-7 w-7 object-contain" />
            </div>

            <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold tracking-tight text-white">
                    CTECH
                </span>

                <span className="text-xs font-medium text-white">
                    Management System
                </span>
            </div>
        </div>
    );
}