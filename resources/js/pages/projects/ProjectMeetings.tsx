import { apiFetch } from '@/lib/fetch';
import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Calendar as CalendarIcon, Clock, Users, FileText, CheckCircle, Video, MapPin, Loader2, CalendarClock,
} from 'lucide-react';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const emptyForm = {
    title: '',
    scheduled_at: '',
    duration_minutes: 60,
    location_or_link: '',
    description: '',
    participants: [] as string[],
};

export default function ProjectMeetings({ project }: { project: any }) {
    const { users } = usePage().props as any;
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({ ...emptyForm });

    const [momData, setMomData] = useState({ id: null as number | null, minutes: '', title: '' });
    const [isMomOpen, setIsMomOpen] = useState(false);

    const fetchMeetings = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`/api/v1/projects/${project.id}/meetings`);
            if (!res.ok) throw new Error('request failed');
            const data = await res.json();
            setMeetings(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Gagal memuat daftar meeting');
            setMeetings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project.id]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await apiFetch(`/api/v1/projects/${project.id}/meetings`, {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                toast.success('Meeting dijadwalkan');
                setIsCreateOpen(false);
                setFormData({ ...emptyForm });
                fetchMeetings();
            } else {
                // Sebelumnya kegagalan tidak memunculkan pesan apa pun
                const firstError = data?.errors ? (Object.values(data.errors)[0] as string[])?.[0] : null;
                toast.error(firstError || data?.message || 'Gagal menjadwalkan meeting');
            }
        } catch {
            toast.error('Gagal terhubung ke server');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveMom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!momData.id) return;
        setSaving(true);
        try {
            const res = await apiFetch(`/api/v1/meetings/${momData.id}/minutes`, {
                method: 'PUT',
                body: JSON.stringify({ minutes_of_meeting: momData.minutes }),
            });
            if (res.ok) {
                toast.success('Notulen tersimpan, meeting ditandai selesai');
                setIsMomOpen(false);
                setMomData({ id: null, minutes: '', title: '' });
                fetchMeetings();
            } else {
                toast.error('Gagal menyimpan notulen');
            }
        } catch {
            toast.error('Gagal terhubung ke server');
        } finally {
            setSaving(false);
        }
    };

    const toggleParticipant = (userId: string) => {
        setFormData((prev) => ({
            ...prev,
            participants: prev.participants.includes(userId)
                ? prev.participants.filter((id) => id !== userId)
                : [...prev.participants, userId],
        }));
    };

    const formatSchedule = (value: string) =>
        new Date(value).toLocaleString('id-ID', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const isUpcoming = (meeting: any) =>
        meeting.status !== 'Completed' && new Date(meeting.scheduled_at).getTime() >= Date.now();

    const upcoming = meetings.filter(isUpcoming);
    const past = meetings.filter((m) => !isUpcoming(m));

    const renderCard = (meeting: any) => {
        const completed = meeting.status === 'Completed';
        const participants = meeting.participants ?? [];

        return (
            <Card key={meeting.id} className="flex flex-col transition-shadow hover:">
                <CardHeader className="pb-2">
                    <div className="mb-2 flex items-start justify-between gap-2">
                        <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                completed
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300'
                            }`}
                        >
                            {completed ? 'Selesai' : 'Terjadwal'}
                        </span>
                        {!completed && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="shrink-0"
                                onClick={() => {
                                    setMomData({ id: meeting.id, minutes: meeting.minutes_of_meeting || '', title: meeting.title });
                                    setIsMomOpen(true);
                                }}
                            >
                                <FileText className="mr-1 h-3 w-3" /> Isi Notulen
                            </Button>
                        )}
                    </div>
                    <CardTitle className="text-base leading-tight">{meeting.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 shrink-0" />
                            <span>
                                {formatSchedule(meeting.scheduled_at)} · {meeting.duration_minutes} menit
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {meeting.location_or_link?.includes('http') ? (
                                <Video className="h-4 w-4 shrink-0 text-blue-500" />
                            ) : (
                                <MapPin className="h-4 w-4 shrink-0" />
                            )}
                            {meeting.location_or_link?.includes('http') ? (
                                <a
                                    href={meeting.location_or_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="truncate text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    {meeting.location_or_link.replace(/^https?:\/\//, '')}
                                </a>
                            ) : (
                                <span className="truncate">{meeting.location_or_link || 'Lokasi belum ditentukan'}</span>
                            )}
                        </div>
                    </div>

                    {meeting.description && (
                        <p className="line-clamp-2 rounded-md bg-muted/50 p-2 text-sm">{meeting.description}</p>
                    )}

                    <div>
                        <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                            <Users className="h-3 w-3" /> Peserta ({participants.length})
                        </p>
                        {participants.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {participants.map((p: any) => (
                                    <Badge key={p.id} variant="outline" className="text-[10px]">
                                        {p.user?.name?.split(' ')[0] ?? 'Tanpa nama'}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs italic text-muted-foreground">Belum ada peserta.</p>
                        )}
                    </div>

                    {completed && meeting.minutes_of_meeting && (
                        <div className="border-t pt-3">
                            <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
                                <CheckCircle className="h-4 w-4 text-emerald-500" /> Notulen Rapat
                            </p>
                            <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                                {meeting.minutes_of_meeting}
                            </p>
                            <Button
                                variant="link"
                                className="h-auto p-0 text-xs"
                                onClick={() => {
                                    setMomData({ id: meeting.id, minutes: meeting.minutes_of_meeting, title: meeting.title });
                                    setIsMomOpen(true);
                                }}
                            >
                                Baca notulen lengkap
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <CalendarClock className="h-5 w-5 text-muted-foreground" /> Meeting & Notulen
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Jadwalkan rapat, catat notulen, dan simpan keputusan penting proyek.
                    </p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="shrink-0">
                            <CalendarIcon className="mr-2 h-4 w-4" /> Jadwalkan Meeting
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Jadwalkan Meeting</DialogTitle>
                            <DialogDescription>Isi jadwal dan agenda, lalu pilih peserta yang perlu hadir.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
                            <div className="space-y-1.5">
                                <Label>Judul Meeting</Label>
                                <Input
                                    required
                                    placeholder="Contoh: Kick-off Project Fase 1"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Tanggal & Waktu</Label>
                                    <Input
                                        required
                                        type="datetime-local"
                                        value={formData.scheduled_at}
                                        onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Durasi (menit)</Label>
                                    <Input
                                        required
                                        type="number"
                                        min="15"
                                        step="15"
                                        value={formData.duration_minutes}
                                        onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Lokasi / Link Video</Label>
                                <Input
                                    placeholder="Link Zoom / Google Meet, atau nama ruangan"
                                    value={formData.location_or_link}
                                    onChange={(e) => setFormData({ ...formData, location_or_link: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">Link yang diawali http akan otomatis bisa diklik.</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Agenda</Label>
                                <Textarea
                                    rows={3}
                                    placeholder="Poin-poin yang akan dibahas"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Peserta ({formData.participants.length} dipilih)</Label>
                                <div className="max-h-36 space-y-1 overflow-y-auto rounded-md border p-2">
                                    {users?.map((u: any) => (
                                        <label
                                            key={u.id}
                                            className="flex cursor-pointer items-center gap-2 rounded p-1.5 text-sm hover:bg-muted"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.participants.includes(u.id.toString())}
                                                onChange={() => toggleParticipant(u.id.toString())}
                                            />
                                            <span>{u.name}</span>
                                            <span className="ml-auto text-xs capitalize text-muted-foreground">
                                                {String(u.role ?? '').replace(/_/g, ' ')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Jadwalkan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center rounded-lg border py-16 text-muted-foreground">
                    <Loader2 className="mb-2 h-8 w-8 animate-spin opacity-50" />
                    <p className="text-sm">Memuat meeting…</p>
                </div>
            ) : meetings.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed p-12 text-center">
                    <CalendarClock className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                    <h3 className="mb-1 text-lg font-semibold">Belum ada meeting</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Jadwalkan rapat pertama agar agenda dan notulen proyek tercatat rapi.
                    </p>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <CalendarIcon className="mr-2 h-4 w-4" /> Jadwalkan Meeting
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {upcoming.length > 0 && (
                        <div>
                            <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                                Akan Datang ({upcoming.length})
                            </h4>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{upcoming.map(renderCard)}</div>
                        </div>
                    )}
                    {past.length > 0 && (
                        <div>
                            <h4 className="mb-3 text-sm font-semibold text-muted-foreground">Riwayat ({past.length})</h4>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{past.map(renderCard)}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Notulen */}
            <Dialog open={isMomOpen} onOpenChange={setIsMomOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Notulen Rapat</DialogTitle>
                        <DialogDescription>
                            {momData.title || 'Catat hasil rapat'} — menyimpan notulen akan menandai meeting ini selesai.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveMom} className="space-y-4">
                        <Textarea
                            className="min-h-[300px]"
                            placeholder={'Contoh:\n\nPembahasan:\n1. ...\n\nKeputusan:\n1. ...\n\nTindak lanjut:\n1. ... (PIC: ..., tenggat: ...)'}
                            value={momData.minutes}
                            onChange={(e) => setMomData({ ...momData, minutes: e.target.value })}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsMomOpen(false)}>
                                Tutup
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan & Tandai Selesai
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
