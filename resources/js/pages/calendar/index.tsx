import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    ChevronLeft, ChevronRight, Clock, Briefcase, Users, Receipt, Megaphone, ListTodo,
    MapPin, AlertTriangle, CheckCircle2, CalendarDays, ExternalLink, CircleDot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type EventType = 'project' | 'task' | 'meeting' | 'invoice' | 'content_plan';

type CalendarEvent = {
    id: string;
    type: EventType;
    title: string;
    date: string; // YYYY-MM-DD
    time?: string;
    description?: string | null;
    status?: string;
    priority?: string;
    location?: string | null;
    duration?: number;
    amount?: number;
    context?: string | null;
    url?: string | null;
    is_done?: boolean;
};

const TYPE_META: Record<EventType, { label: string; icon: any; dot: string; bar: string; chip: string; soft: string }> = {
    project: {
        label: 'Deadline Project',
        icon: Briefcase,
        dot: 'bg-indigo-500',
        bar: 'border-l-indigo-500',
        chip: 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300',
        soft: 'bg-indigo-50/70 dark:bg-indigo-950/30',
    },
    task: {
        label: 'Task',
        icon: ListTodo,
        dot: 'bg-emerald-500',
        bar: 'border-l-emerald-500',
        chip: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300',
        soft: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    },
    meeting: {
        label: 'Meeting',
        icon: Users,
        dot: 'bg-violet-500',
        bar: 'border-l-violet-500',
        chip: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300',
        soft: 'bg-violet-50/70 dark:bg-violet-950/30',
    },
    invoice: {
        label: 'Jatuh Tempo Invoice',
        icon: Receipt,
        dot: 'bg-amber-500',
        bar: 'border-l-amber-500',
        chip: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300',
        soft: 'bg-amber-50/70 dark:bg-amber-950/30',
    },
    content_plan: {
        label: 'Konten',
        icon: Megaphone,
        dot: 'bg-pink-500',
        bar: 'border-l-pink-500',
        chip: 'border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-900 dark:bg-pink-950/50 dark:text-pink-300',
        soft: 'bg-pink-50/70 dark:bg-pink-950/30',
    },
};

const TYPES = Object.keys(TYPE_META) as EventType[];

// Minggu dimulai Senin, sesuai kebiasaan penanggalan Indonesia
const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const toKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

export default function CalendarIndex({ events: initialEvents }: { events: CalendarEvent[] }) {
    const [viewMode, setViewMode] = useState<'bulan' | 'minggu' | 'agenda'>('bulan');
    const [cursor, setCursor] = useState(() => startOfToday());
    const [selectedKey, setSelectedKey] = useState<string>(() => toKey(startOfToday()));
    const [hiddenTypes, setHiddenTypes] = useState<EventType[]>([]);

    const today = startOfToday();
    const todayKey = toKey(today);

    const events = useMemo(() => initialEvents ?? [], [initialEvents]);

    const visibleEvents = useMemo(
        () => events.filter((e) => !hiddenTypes.includes(e.type)),
        [events, hiddenTypes],
    );

    /** Pengelompokan per tanggal supaya pencarian per hari tidak O(n) berulang. */
    const byDate = useMemo(() => {
        const map: Record<string, CalendarEvent[]> = {};
        for (const event of visibleEvents) {
            (map[event.date] ??= []).push(event);
        }
        for (const key of Object.keys(map)) {
            map[key].sort((a, b) => (a.time ?? '99:99').localeCompare(b.time ?? '99:99'));
        }
        return map;
    }, [visibleEvents]);

    const typeCounts = useMemo(() => {
        const counts = {} as Record<EventType, number>;
        for (const type of TYPES) counts[type] = 0;
        for (const event of events) counts[event.type]++;
        return counts;
    }, [events]);

    const isOverdue = (event: CalendarEvent) => !event.is_done && event.date < todayKey;

    const stats = useMemo(() => {
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const weekEndKey = toKey(weekEnd);

        return {
            today: visibleEvents.filter((e) => e.date === todayKey).length,
            week: visibleEvents.filter((e) => e.date >= todayKey && e.date < weekEndKey).length,
            overdue: visibleEvents.filter(isOverdue).length,
            total: visibleEvents.length,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibleEvents, todayKey]);

    /** 6 baris penuh termasuk tanggal bulan sebelum/sesudah — layout kalender standar. */
    const monthGrid = useMemo(() => {
        const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
        const offset = (first.getDay() + 6) % 7; // Senin = 0
        const start = new Date(first);
        start.setDate(start.getDate() - offset);

        return Array.from({ length: 42 }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            return date;
        });
    }, [cursor]);

    const weekDays = useMemo(() => {
        const offset = (cursor.getDay() + 6) % 7;
        const start = new Date(cursor);
        start.setDate(start.getDate() - offset);

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            return date;
        });
    }, [cursor]);

    const selectedEvents = byDate[selectedKey] ?? [];

    const shift = (direction: -1 | 1) => {
        const next = new Date(cursor);
        if (viewMode === 'bulan') next.setMonth(next.getMonth() + direction);
        else next.setDate(next.getDate() + direction * 7);
        setCursor(next);
    };

    const toggleType = (type: EventType) => {
        setHiddenTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
    };

    const periodLabel = () => {
        if (viewMode === 'bulan') return `${MONTH_NAMES[cursor.getMonth()]} ${cursor.getFullYear()}`;
        if (viewMode === 'minggu') {
            const a = weekDays[0];
            const b = weekDays[6];
            const sameMonth = a.getMonth() === b.getMonth();
            return sameMonth
                ? `${a.getDate()}–${b.getDate()} ${MONTH_NAMES[a.getMonth()]} ${a.getFullYear()}`
                : `${a.getDate()} ${MONTH_NAMES[a.getMonth()]} – ${b.getDate()} ${MONTH_NAMES[b.getMonth()]} ${b.getFullYear()}`;
        }
        return 'Agenda Mendatang';
    };

    /** Baris kecil di dalam sel kalender. */
    const EventChip = ({ event }: { event: CalendarEvent }) => {
        const meta = TYPE_META[event.type];
        const overdue = isOverdue(event);

        return (
            <div
                className={`flex items-center gap-1 rounded px-1 py-0.5 text-[11px] leading-tight ${meta.soft} ${
                    event.is_done ? 'opacity-55' : ''
                }`}
                title={`${meta.label}: ${event.title}`}
            >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${overdue ? 'bg-rose-500' : meta.dot}`} />
                {event.time && <span className="shrink-0 font-medium tabular-nums">{event.time}</span>}
                <span className={`truncate ${event.is_done ? 'line-through' : ''}`}>{event.title}</span>
            </div>
        );
    };

    /** Kartu rincian di panel kanan / agenda. */
    const EventCard = ({ event }: { event: CalendarEvent }) => {
        const meta = TYPE_META[event.type];
        const Icon = meta.icon;
        const overdue = isOverdue(event);

        const body = (
            <div
                className={`rounded-lg border border-l-[3px] bg-card p-3 transition-shadow hover: ${meta.bar} ${
                    event.is_done ? 'opacity-70' : ''
                }`}
            >
                <div className="mb-1 flex items-start justify-between gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${meta.chip}`}>
                        <Icon className="h-3 w-3" />
                        {meta.label}
                    </span>
                    {overdue ? (
                        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                            <AlertTriangle className="h-3 w-3" /> Lewat
                        </span>
                    ) : event.is_done ? (
                        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Selesai
                        </span>
                    ) : null}
                </div>

                <p className={`text-sm font-semibold leading-snug ${event.is_done ? 'line-through' : ''}`}>{event.title}</p>

                {event.context && <p className="mt-0.5 truncate text-xs text-muted-foreground">{event.context}</p>}

                {event.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{event.description}</p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                    {event.time && (
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                            {event.duration ? ` · ${event.duration} menit` : ''}
                        </span>
                    )}
                    {event.location && (
                        <span className="flex min-w-0 items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{event.location.replace(/^https?:\/\//, '')}</span>
                        </span>
                    )}
                    {typeof event.amount === 'number' && (
                        <span className="font-medium text-foreground">{formatRupiah(event.amount)}</span>
                    )}
                    {event.priority && (
                        <span className="flex items-center gap-1">
                            <CircleDot className="h-3 w-3" />
                            {event.priority}
                        </span>
                    )}
                    {event.status && <span className="rounded bg-muted px-1.5 py-0.5">{event.status}</span>}
                </div>
            </div>
        );

        return event.url ? (
            <Link href={event.url} className="block">
                <div className="group relative">
                    {body}
                    <ExternalLink className="absolute right-3 top-9 h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
            </Link>
        ) : (
            body
        );
    };

    return (
        <>
            <Head title="Kalender" />
            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Kalender</h2>
                        <p className="text-sm text-muted-foreground">
                            Semua tenggat project, task, meeting, jadwal konten, dan jatuh tempo invoice dalam satu tampilan.
                        </p>
                    </div>
                </div>

                {/* Ringkasan */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                        { label: 'Hari Ini', value: stats.today, icon: CalendarDays, tone: 'text-foreground' },
                        { label: '7 Hari ke Depan', value: stats.week, icon: Clock, tone: 'text-foreground' },
                        {
                            label: 'Lewat Tenggat',
                            value: stats.overdue,
                            icon: AlertTriangle,
                            tone: stats.overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-foreground',
                        },
                        { label: 'Total Agenda', value: stats.total, icon: CircleDot, tone: 'text-foreground' },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-lg border bg-card p-3.5">
                            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                <stat.icon className="h-3.5 w-3.5" />
                                {stat.label}
                            </p>
                            <p className={`mt-1 text-2xl font-bold leading-none ${stat.tone}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Kontrol + filter jenis (sekaligus legenda) */}
                <div className="space-y-3 rounded-lg border bg-card p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => shift(-1)} disabled={viewMode === 'agenda'}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => shift(1)} disabled={viewMode === 'agenda'}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => {
                                    setCursor(startOfToday());
                                    setSelectedKey(todayKey);
                                }}
                            >
                                Hari Ini
                            </Button>
                            <h3 className="ml-1 text-base font-semibold">{periodLabel()}</h3>
                        </div>

                        {/* Pemilih tampilan bergaya segmented control */}
                        <div className="inline-flex rounded-lg border bg-muted/40 p-0.5">
                            {(['bulan', 'minggu', 'agenda'] as const).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setViewMode(mode)}
                                    className={`rounded-md px-3 py-1 text-sm font-medium capitalize transition-colors ${
                                        viewMode === mode ? 'bg-background ' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 border-t pt-3">
                        {TYPES.map((type) => {
                            const meta = TYPE_META[type];
                            const active = !hiddenTypes.includes(type);

                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => toggleType(type)}
                                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                                        active ? meta.chip : 'border-border bg-transparent text-muted-foreground opacity-60'
                                    }`}
                                    title={active ? 'Klik untuk menyembunyikan' : 'Klik untuk menampilkan'}
                                >
                                    <span className={`h-2 w-2 rounded-full ${active ? meta.dot : 'bg-muted-foreground/40'}`} />
                                    {meta.label}
                                    <span className="opacity-60">{typeCounts[type]}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Isi kalender */}
                {viewMode === 'agenda' ? (
                    <AgendaView events={visibleEvents} todayKey={todayKey} EventCard={EventCard} />
                ) : (
                    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                        <div className="overflow-hidden rounded-lg border bg-card">
                            {/* Nama hari */}
                            <div className="grid grid-cols-7 border-b bg-muted/30">
                                {DAY_NAMES.map((day, i) => (
                                    <div
                                        key={day}
                                        className={`py-2 text-center text-xs font-semibold ${
                                            i >= 5 ? 'text-muted-foreground/70' : 'text-muted-foreground'
                                        }`}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {viewMode === 'bulan' ? (
                                <div className="grid grid-cols-7">
                                    {monthGrid.map((date, index) => {
                                        const key = toKey(date);
                                        const dayEvents = byDate[key] ?? [];
                                        const isCurrentMonth = date.getMonth() === cursor.getMonth();
                                        const isToday = key === todayKey;
                                        const isSelected = key === selectedKey;
                                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                        const shown = dayEvents.slice(0, 3);

                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setSelectedKey(key)}
                                                className={`min-h-[104px] border-b border-r p-1.5 text-left align-top transition-colors last:border-r-0 ${
                                                    index % 7 === 6 ? 'border-r-0' : ''
                                                } ${!isCurrentMonth ? 'bg-muted/20' : isWeekend ? 'bg-muted/10' : ''} ${
                                                    isSelected ? 'ring-2 ring-inset ring-primary' : 'hover:bg-muted/40'
                                                }`}
                                            >
                                                <div className="mb-1 flex items-center justify-between">
                                                    <span
                                                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                                                            isToday
                                                                ? 'bg-primary text-primary-foreground'
                                                                : isCurrentMonth
                                                                    ? 'text-foreground'
                                                                    : 'text-muted-foreground/50'
                                                        }`}
                                                    >
                                                        {date.getDate()}
                                                    </span>
                                                    {dayEvents.length > 0 && (
                                                        <span className="text-[10px] font-medium text-muted-foreground">
                                                            {dayEvents.length}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-0.5">
                                                    {shown.map((event) => (
                                                        <EventChip key={event.id} event={event} />
                                                    ))}
                                                    {dayEvents.length > 3 && (
                                                        <p className="px-1 text-[10px] font-medium text-muted-foreground">
                                                            +{dayEvents.length - 3} lainnya
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="grid grid-cols-7">
                                    {weekDays.map((date, index) => {
                                        const key = toKey(date);
                                        const dayEvents = byDate[key] ?? [];
                                        const isToday = key === todayKey;
                                        const isSelected = key === selectedKey;

                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setSelectedKey(key)}
                                                className={`min-h-[420px] border-b border-r p-2 text-left align-top transition-colors ${
                                                    index === 6 ? 'border-r-0' : ''
                                                } ${isSelected ? 'ring-2 ring-inset ring-primary' : 'hover:bg-muted/30'}`}
                                            >
                                                <div className="mb-2 flex items-center gap-1.5">
                                                    <span
                                                        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                                                            isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'
                                                        }`}
                                                    >
                                                        {date.getDate()}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {MONTH_NAMES[date.getMonth()].slice(0, 3)}
                                                    </span>
                                                </div>

                                                <div className="space-y-1">
                                                    {dayEvents.map((event) => (
                                                        <EventChip key={event.id} event={event} />
                                                    ))}
                                                    {dayEvents.length === 0 && (
                                                        <p className="text-[11px] italic text-muted-foreground/60">Kosong</p>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Panel rincian hari terpilih */}
                        <aside className="flex flex-col rounded-lg border bg-card">
                            <div className="border-b p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    {selectedKey === todayKey ? 'Hari Ini' : 'Tanggal Terpilih'}
                                </p>
                                <p className="mt-0.5 font-semibold">
                                    {new Date(`${selectedKey}T00:00:00`).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {selectedEvents.length > 0 ? `${selectedEvents.length} agenda` : 'Tidak ada agenda'}
                                </p>
                            </div>

                            <div className="max-h-[560px] flex-1 space-y-2 overflow-y-auto p-3">
                                {selectedEvents.length > 0 ? (
                                    selectedEvents.map((event) => <EventCard key={event.id} event={event} />)
                                ) : (
                                    <div className="py-12 text-center">
                                        <CalendarDays className="mx-auto mb-2 h-9 w-9 text-muted-foreground/25" />
                                        <p className="text-sm text-muted-foreground">Tidak ada agenda pada tanggal ini.</p>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </>
    );
}

/** Agenda: dikelompokkan per tanggal, mendatang lebih dulu. */
function AgendaView({
    events,
    todayKey,
    EventCard,
}: {
    events: CalendarEvent[];
    todayKey: string;
    EventCard: (props: { event: CalendarEvent }) => React.ReactElement;
}) {
    const [showPast, setShowPast] = useState(false);

    const upcoming = events.filter((e) => e.date >= todayKey).sort((a, b) => a.date.localeCompare(b.date));
    const past = events.filter((e) => e.date < todayKey).sort((a, b) => b.date.localeCompare(a.date));
    const list = showPast ? past : upcoming;

    const grouped = useMemo(() => {
        const map: Record<string, CalendarEvent[]> = {};
        for (const event of list) (map[event.date] ??= []).push(event);
        return Object.entries(map);
    }, [list]);

    return (
        <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b p-3">
                <div className="inline-flex rounded-lg border bg-muted/40 p-0.5">
                    <button
                        type="button"
                        onClick={() => setShowPast(false)}
                        className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                            !showPast ? 'bg-background ' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Mendatang ({upcoming.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowPast(true)}
                        className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                            showPast ? 'bg-background ' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Sudah Lewat ({past.length})
                    </button>
                </div>
            </div>

            <div className="divide-y">
                {grouped.length === 0 && (
                    <div className="py-16 text-center">
                        <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground/25" />
                        <p className="font-medium">{showPast ? 'Belum ada agenda yang lewat' : 'Tidak ada agenda mendatang'}</p>
                        <p className="text-sm text-muted-foreground">Agenda akan muncul otomatis dari project, task, dan meeting.</p>
                    </div>
                )}

                {grouped.map(([date, dayEvents]) => {
                    const parsed = new Date(`${date}T00:00:00`);
                    const isToday = date === todayKey;

                    return (
                        <div key={date} className="flex gap-4 p-4">
                            {/* Kolom tanggal */}
                            <div className="w-16 shrink-0 text-center">
                                <p className="text-[11px] uppercase text-muted-foreground">
                                    {parsed.toLocaleDateString('id-ID', { weekday: 'short' })}
                                </p>
                                <p
                                    className={`mx-auto mt-0.5 flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold ${
                                        isToday ? 'bg-primary text-primary-foreground' : ''
                                    }`}
                                >
                                    {parsed.getDate()}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                    {parsed.toLocaleDateString('id-ID', { month: 'short' })}
                                </p>
                            </div>

                            <div className="min-w-0 flex-1 space-y-2">
                                {dayEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

CalendarIndex.layout = {
    breadcrumbs: [{ title: 'Kalender', href: '/calendar' }],
};
