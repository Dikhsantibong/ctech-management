import { TrendingUp, TrendingDown, Target as TargetIcon, Pencil } from 'lucide-react';

export type KpiMetric = {
    key: string;
    label: string;
    description: string;
    unit: 'number' | 'percent' | 'currency';
    direction: 'up' | 'down';
    actual: number;
    target: number;
    achievement: number;
    is_custom_target: boolean;
};

export type RoleKpi = {
    role: string;
    role_label: string;
    period: string;
    score: number | null;
    metrics: KpiMetric[];
};

export const formatKpiValue = (value: number, unit: KpiMetric['unit']) => {
    if (unit === 'currency') {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
            notation: value >= 1_000_000 ? 'compact' : 'standard',
        }).format(value);
    }
    if (unit === 'percent') {
        return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
    }
    return new Intl.NumberFormat('id-ID').format(value);
};

/** Hijau ≥100%, kuning 75–99%, merah di bawah itu. */
export const achievementTone = (achievement: number) => {
    if (achievement >= 100) {
        return {
            text: 'text-emerald-600 dark:text-emerald-400',
            bar: 'bg-emerald-500',
            chip: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
            label: 'Tercapai',
        };
    }
    if (achievement >= 75) {
        return {
            text: 'text-amber-600 dark:text-amber-400',
            bar: 'bg-amber-500',
            chip: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
            label: 'Hampir',
        };
    }
    return {
        text: 'text-rose-600 dark:text-rose-400',
        bar: 'bg-rose-500',
        chip: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300',
        label: 'Di bawah target',
    };
};

export function KpiMetricRow({
    metric,
    onEditTarget,
}: {
    metric: KpiMetric;
    onEditTarget?: (metric: KpiMetric) => void;
}) {
    const tone = achievementTone(metric.achievement);
    const DirectionIcon = metric.direction === 'up' ? TrendingUp : TrendingDown;

    return (
        <div className="rounded-lg border bg-card p-3">
            <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                        <DirectionIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        {metric.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{metric.description}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tone.chip}`}>
                    {metric.achievement}%
                </span>
            </div>

            <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span className={`text-lg font-bold ${tone.text}`}>{formatKpiValue(metric.actual, metric.unit)}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TargetIcon className="h-3 w-3" />
                    Target {formatKpiValue(metric.target, metric.unit)}
                    {metric.is_custom_target && <span className="text-[10px] opacity-70">(disetel)</span>}
                    {onEditTarget && (
                        <button
                            type="button"
                            onClick={() => onEditTarget(metric)}
                            className="ml-0.5 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="Ubah target"
                        >
                            <Pencil className="h-3 w-3" />
                        </button>
                    )}
                </span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${tone.bar}`}
                    style={{ width: `${Math.min(metric.achievement, 100)}%` }}
                />
            </div>
        </div>
    );
}

/** Ringkasan KPI satu role — dipakai di dashboard maupun halaman monitoring. */
export default function KpiPanel({
    kpi,
    onEditTarget,
    compact = false,
}: {
    kpi: RoleKpi;
    onEditTarget?: (metric: KpiMetric) => void;
    compact?: boolean;
}) {
    if (!kpi || kpi.metrics.length === 0) return null;

    const tone = achievementTone(kpi.score ?? 0);

    return (
        <div className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b p-4">
                <div>
                    <h3 className="text-base font-semibold">{compact ? 'KPI Saya' : kpi.role_label}</h3>
                    <p className="text-xs text-muted-foreground">
                        {kpi.metrics.length} indikator · periode{' '}
                        {new Date(`${kpi.period}-01`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold leading-none ${tone.text}`}>{kpi.score}%</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{tone.label}</p>
                </div>
            </div>

            <div className={`grid gap-3 p-4 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
                {kpi.metrics.map((metric) => (
                    <KpiMetricRow key={metric.key} metric={metric} onEditTarget={onEditTarget} />
                ))}
            </div>
        </div>
    );
}
