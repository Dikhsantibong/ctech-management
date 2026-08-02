import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Gauge, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import KpiPanel, { achievementTone, formatKpiValue, type KpiMetric, type RoleKpi } from '@/components/kpi-panel';

export default function KpiIndex({
    period,
    periods,
    roles,
}: {
    period: string;
    periods: { value: string; label: string }[];
    roles: RoleKpi[];
}) {
    const [editing, setEditing] = useState<{ role: RoleKpi; metric: KpiMetric } | null>(null);

    const { data, setData, processing } = useForm({ target_value: '' });

    const changePeriod = (value: string) => {
        router.get('/kpi', { period: value }, { preserveState: true, preserveScroll: true });
    };

    const openEditor = (role: RoleKpi, metric: KpiMetric) => {
        setEditing({ role, metric });
        setData('target_value', String(metric.target));
    };

    const saveTarget = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;

        router.put(
            '/kpi/target',
            {
                role: editing.role.role,
                metric_key: editing.metric.key,
                period,
                target_value: Number(data.target_value),
            },
            {
                preserveScroll: true,
                onSuccess: () => setEditing(null),
            },
        );
    };

    const resetTarget = () => {
        if (!editing) return;

        router.delete('/kpi/target', {
            data: { role: editing.role.role, metric_key: editing.metric.key, period },
            preserveScroll: true,
            onSuccess: () => setEditing(null),
        } as any);
    };

    // Skor perusahaan = rata-rata skor seluruh role yang punya indikator
    const scored = roles.filter((r) => r.score !== null && r.metrics.length > 0);
    const companyScore = scored.length > 0 ? Math.round(scored.reduce((sum, r) => sum + (r.score ?? 0), 0) / scored.length) : 0;
    const companyTone = achievementTone(companyScore);

    return (
        <>
            <Head title="Monitoring KPI" />
            <div className="flex flex-1 flex-col gap-5 p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Gauge className="h-6 w-6 text-muted-foreground" /> Monitoring KPI
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Capaian tiap role dihitung otomatis dari data operasional. Klik ikon pensil untuk menyesuaikan target.
                        </p>
                    </div>
                    <div className="w-full sm:w-56">
                        <Select value={period} onValueChange={changePeriod}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {periods.map((p) => (
                                    <SelectItem key={p.value} value={p.value}>
                                        {p.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Ringkasan skor */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-card p-4 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Skor Perusahaan</p>
                        <p className={`mt-1 text-3xl font-bold leading-none ${companyTone.text}`}>{companyScore}%</p>
                        <p className="mt-1 text-xs text-muted-foreground">Rata-rata {scored.length} role</p>
                    </div>

                    {roles.map((role) => {
                        const tone = achievementTone(role.score ?? 0);
                        const behind = role.metrics.filter((m) => m.achievement < 75).length;

                        return (
                            <div key={role.role} className="rounded-xl border bg-card p-4 shadow-sm">
                                <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    {role.role_label}
                                </p>
                                <p className={`mt-1 text-3xl font-bold leading-none ${tone.text}`}>{role.score}%</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {behind > 0 ? `${behind} indikator perlu perhatian` : 'Semua indikator aman'}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Rincian per role */}
                <div className="grid gap-5 xl:grid-cols-2">
                    {roles.map((role) => (
                        <KpiPanel key={role.role} kpi={role} onEditTarget={(metric) => openEditor(role, metric)} />
                    ))}
                </div>
            </div>

            {/* Ubah target */}
            <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ubah Target</DialogTitle>
                        <DialogDescription>
                            {editing?.metric.label} — {editing?.role.role_label}, periode{' '}
                            {periods.find((p) => p.value === period)?.label}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={saveTarget} className="space-y-4">
                        <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                            <p className="text-muted-foreground">{editing?.metric.description}</p>
                            <p className="mt-2">
                                Realisasi saat ini:{' '}
                                <span className="font-semibold">
                                    {editing ? formatKpiValue(editing.metric.actual, editing.metric.unit) : '-'}
                                </span>
                            </p>
                            {editing?.metric.direction === 'down' && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Indikator ini makin kecil makin baik — target adalah batas maksimum yang ditoleransi.
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label>
                                Target{' '}
                                {editing?.metric.unit === 'percent' ? '(%)' : editing?.metric.unit === 'currency' ? '(Rupiah)' : ''}
                            </Label>
                            <Input
                                type="number"
                                min={0}
                                step={editing?.metric.unit === 'currency' ? 100000 : 1}
                                value={data.target_value}
                                onChange={(e) => setData('target_value', e.target.value)}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Target hanya berlaku untuk periode ini, jadi bulan lain tidak ikut berubah.
                            </p>
                        </div>

                        <DialogFooter className="gap-2 sm:justify-between">
                            {editing?.metric.is_custom_target ? (
                                <Button type="button" variant="ghost" onClick={resetTarget}>
                                    <RotateCcw className="mr-2 h-4 w-4" /> Kembalikan bawaan
                                </Button>
                            ) : (
                                <span />
                            )}
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Simpan Target
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

KpiIndex.layout = {
    breadcrumbs: [{ title: 'Monitoring KPI', href: '/kpi' }],
};
