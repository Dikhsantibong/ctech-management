import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft, Building2, Phone, Mail, MessageCircle, Pencil, FileSpreadsheet, UserCheck,
    Plus, CheckCircle2, Trash2, MapPin, Globe, Linkedin, Clock, Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    formatCurrency, formatDate, formatDateTime, stageColor, priorityColor, statusColor,
    activityStatusColor, whatsappLink, messageTemplate,
} from '@/lib/crm';

const ALL = '__all__';

export default function ProspectShow({ prospect, options, activityTypes, needFields }: {
    prospect: any; options: any; activityTypes: string[]; needFields: Record<string, string>;
}) {
    const [editOpen, setEditOpen] = useState(false);
    const [activityOpen, setActivityOpen] = useState(false);
    const [convertOpen, setConvertOpen] = useState(false);
    const [stageNote, setStageNote] = useState('');

    const wa = whatsappLink(prospect.pic_whatsapp || prospect.company_whatsapp, messageTemplate(prospect.stage, prospect.company_name, prospect.pic_name));
    const phone = prospect.pic_phone || prospect.company_phone;
    const email = prospect.pic_email || prospect.company_email;

    const moveStage = (stage: string) => {
        router.put(`/crm/prospek/${prospect.id}/stage`, { stage, note: stageNote || null }, {
            preserveScroll: true,
            onSuccess: () => setStageNote(''),
        });
    };

    const convert = () => {
        router.post(`/crm/prospek/${prospect.id}/convert`, {}, { preserveScroll: true, onSuccess: () => setConvertOpen(false) });
    };

    const completeActivity = (id: number) => {
        router.put(`/crm/aktivitas/${id}/selesai`, {}, { preserveScroll: true });
    };

    const deleteActivity = (id: number) => {
        router.delete(`/crm/aktivitas/${id}`, { preserveScroll: true });
    };

    const stages: string[] = options.stages;
    const currentIndex = stages.indexOf(prospect.stage);

    return (
        <>
            <Head title={prospect.company_name} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <Link href="/crm/prospek" className="mt-1 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold tracking-tight">{prospect.company_name}</h2>
                                {prospect.brand_name && <span className="text-muted-foreground">({prospect.brand_name})</span>}
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className={stageColor(prospect.stage)}>{prospect.stage}</Badge>
                                <Badge variant="outline" className={priorityColor(prospect.priority)}>Prioritas {prospect.priority}</Badge>
                                <Badge variant="outline" className={statusColor(prospect.status)}>{prospect.status}</Badge>
                                {prospect.industry && <span className="text-sm text-muted-foreground">{prospect.industry}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {wa && <Button variant="outline" size="sm" asChild><a href={wa} target="_blank" rel="noreferrer"><MessageCircle className="mr-1.5 h-4 w-4 text-emerald-600" /> WhatsApp</a></Button>}
                        {phone && <Button variant="outline" size="sm" asChild><a href={`tel:${phone}`}><Phone className="mr-1.5 h-4 w-4" /> Telepon</a></Button>}
                        {email && <Button variant="outline" size="sm" asChild><a href={`mailto:${email}`}><Mail className="mr-1.5 h-4 w-4" /> Email</a></Button>}
                        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}><Pencil className="mr-1.5 h-4 w-4" /> Edit</Button>
                        <Button size="sm" asChild><Link href={`/quotations/create?prospect_id=${prospect.id}`}><FileSpreadsheet className="mr-1.5 h-4 w-4" /> Buat Penawaran</Link></Button>
                    </div>
                </div>

                {/* Pipeline stepper */}
                <div className="rounded-lg border bg-card p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Tahap Pipeline</h3>
                        <div className="flex items-center gap-2">
                            <Input value={stageNote} onChange={(e) => setStageNote(e.target.value)} placeholder="Catatan perpindahan (opsional)" className="h-8 w-56" />
                            <Select value={ALL} onValueChange={(v) => v !== ALL && moveStage(v)}>
                                <SelectTrigger size="sm" className="w-40"><SelectValue placeholder="Ubah tahap" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL}>Ubah tahap ke...</SelectItem>
                                    {stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="flex min-w-max items-center gap-1">
                            {stages.map((s, i) => {
                                const done = i < currentIndex;
                                const active = i === currentIndex;
                                return (
                                    <div key={s} className="flex items-center">
                                        <button
                                            onClick={() => moveStage(s)}
                                            className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${active ? 'border-primary bg-primary text-primary-foreground' : done ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                                        >
                                            {s}
                                        </button>
                                        {i < stages.length - 1 && <span className="mx-0.5 text-muted-foreground">›</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Kebutuhan */}
                        <Section title="Kebutuhan" action={<Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}><Pencil className="mr-1.5 h-4 w-4" /> Lengkapi</Button>}>
                            {prospect.needs && Object.values(prospect.needs).some(Boolean) ? (
                                <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                                    {Object.entries(needFields).map(([key, label]) => (
                                        prospect.needs?.[key] ? (
                                            <div key={key}>
                                                <dt className="text-xs text-muted-foreground">{label}</dt>
                                                <dd className="text-sm">{prospect.needs[key]}</dd>
                                            </div>
                                        ) : null
                                    ))}
                                </dl>
                            ) : (
                                <p className="text-sm text-muted-foreground">Belum ada detail kebutuhan. Isi saat tahap Analisis Kebutuhan.</p>
                            )}
                            {prospect.products_interest && (
                                <div className="mt-4 border-t pt-3">
                                    <dt className="text-xs text-muted-foreground">Produk/Layanan Diminati</dt>
                                    <dd className="text-sm">{prospect.products_interest}</dd>
                                </div>
                            )}
                        </Section>

                        {/* Aktivitas */}
                        <Section title="Aktivitas" action={<Button variant="outline" size="sm" onClick={() => setActivityOpen(true)}><Plus className="mr-1.5 h-4 w-4" /> Tambah</Button>}>
                            {prospect.activities?.length ? (
                                <ol className="space-y-3">
                                    {prospect.activities.map((a: any) => (
                                        <li key={a.id} className="flex gap-3 rounded-md border p-3">
                                            <div className="mt-0.5"><Clock className="h-4 w-4 text-muted-foreground" /></div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-medium">{a.type}</span>
                                                    <Badge variant="outline" className={activityStatusColor(a.status)}>{a.status}</Badge>
                                                    <span className="text-xs text-muted-foreground">{a.scheduled_at ? formatDateTime(a.scheduled_at) : ''}</span>
                                                </div>
                                                <div className="text-sm">{a.subject}</div>
                                                {a.description && <div className="mt-1 text-sm text-muted-foreground">{a.description}</div>}
                                                {a.outcome && <div className="mt-1 text-sm"><span className="text-muted-foreground">Hasil: </span>{a.outcome}</div>}
                                                <div className="mt-1 text-xs text-muted-foreground">{a.user?.name}</div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                {a.status !== 'Selesai' && <Button variant="ghost" size="sm" onClick={() => completeActivity(a.id)}><CheckCircle2 className="h-4 w-4 text-emerald-600" /></Button>}
                                                <Button variant="ghost" size="sm" onClick={() => deleteActivity(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-sm text-muted-foreground">Belum ada aktivitas. Catat komunikasi pertama Anda.</p>
                            )}
                        </Section>

                        {/* Penawaran */}
                        <Section title="Penawaran" action={<Button variant="outline" size="sm" asChild><Link href={`/quotations/create?prospect_id=${prospect.id}`}><Plus className="mr-1.5 h-4 w-4" /> Buat</Link></Button>}>
                            {prospect.quotations?.length ? (
                                <div className="divide-y">
                                    {prospect.quotations.map((q: any) => (
                                        <div key={q.id} className="flex items-center justify-between py-2.5">
                                            <div>
                                                <Link href={`/quotations/${q.id}`} className="text-sm font-medium hover:underline">{q.quotation_number}</Link>
                                                <div className="text-xs text-muted-foreground">{q.subject}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{formatCurrency(q.total)}</div>
                                                <Badge variant="outline" className="mt-0.5">{q.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Belum ada penawaran untuk prospek ini.</p>
                            )}
                        </Section>

                        {/* Timeline */}
                        <Section title="Riwayat Tahap">
                            {prospect.stage_histories?.length ? (
                                <ol className="relative space-y-4 border-l pl-4">
                                    {prospect.stage_histories.map((h: any) => (
                                        <li key={h.id} className="relative">
                                            <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                                            <div className="text-sm">{h.from_stage ? `${h.from_stage} → ` : ''}<span className="font-medium">{h.to_stage}</span></div>
                                            {h.note && <div className="text-sm text-muted-foreground">{h.note}</div>}
                                            <div className="text-xs text-muted-foreground">{formatDateTime(h.created_at)} · {h.changed_by?.name ?? 'Sistem'}</div>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-sm text-muted-foreground">Belum ada perpindahan tahap.</p>
                            )}
                        </Section>
                    </div>

                    {/* Side column */}
                    <div className="space-y-6">
                        {prospect.client_id && (
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                <div className="flex items-center gap-2 text-emerald-700"><UserCheck className="h-4 w-4" /><span className="text-sm font-medium">Sudah menjadi Customer</span></div>
                                <Link href={`/clients/${prospect.client_id}`} className="mt-1 inline-block text-sm text-emerald-800 hover:underline">Lihat Customer #{prospect.client_id}</Link>
                            </div>
                        )}

                        <Section title="Opportunity">
                            <dl className="space-y-2.5 text-sm">
                                <Row label="Nilai Peluang" value={prospect.estimated_value ? formatCurrency(prospect.estimated_value) : '-'} />
                                <Row label="Target Closing" value={formatDate(prospect.expected_close_date)} />
                                <Row label="Next Action" value={prospect.next_action ?? '-'} />
                                <Row label="Follow-up" value={prospect.next_follow_up_at ? formatDateTime(prospect.next_follow_up_at) : '-'} />
                                <Row label="Sumber" value={prospect.source ?? '-'} />
                                <Row label="Sales" value={prospect.sales?.name ?? '-'} />
                            </dl>
                            {!prospect.client_id && (
                                <Button className="mt-4 w-full" variant="outline" onClick={() => setConvertOpen(true)}><UserCheck className="mr-2 h-4 w-4" /> Konversi ke Customer</Button>
                            )}
                        </Section>

                        <Section title="Informasi Perusahaan">
                            <dl className="space-y-2.5 text-sm">
                                <IconRow icon={Building2} value={`${prospect.company_type ?? ''} ${prospect.company_name}`.trim()} />
                                <IconRow icon={MapPin} value={[prospect.address, prospect.city, prospect.province].filter(Boolean).join(', ') || '-'} />
                                {prospect.website && <IconRow icon={Globe} value={prospect.website} />}
                                {prospect.company_phone && <IconRow icon={Phone} value={prospect.company_phone} />}
                                {prospect.company_email && <IconRow icon={Mail} value={prospect.company_email} />}
                            </dl>
                        </Section>

                        <Section title="PIC / Kontak">
                            <dl className="space-y-2.5 text-sm">
                                <Row label="Nama" value={prospect.pic_name ?? '-'} />
                                <Row label="Jabatan" value={prospect.pic_position ?? '-'} />
                                {prospect.pic_phone && <IconRow icon={Phone} value={prospect.pic_phone} />}
                                {prospect.pic_whatsapp && <IconRow icon={MessageCircle} value={prospect.pic_whatsapp} />}
                                {prospect.pic_email && <IconRow icon={Mail} value={prospect.pic_email} />}
                                {prospect.pic_linkedin && <IconRow icon={Linkedin} value={prospect.pic_linkedin} />}
                            </dl>
                        </Section>
                    </div>
                </div>
            </div>

            <EditProspectDialog open={editOpen} onClose={() => setEditOpen(false)} prospect={prospect} options={options} needFields={needFields} />
            <ActivityDialog open={activityOpen} onClose={() => setActivityOpen(false)} prospectId={prospect.id} activityTypes={activityTypes} />

            <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konversi ke Customer</DialogTitle>
                        <DialogDescription>
                            Sistem akan mencari Customer yang cocok. Jika belum ada, Customer baru dibuat dari data prospek ini. Riwayat prospek tetap tersimpan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConvertOpen(false)}>Batal</Button>
                        <Button onClick={convert}><UserCheck className="mr-2 h-4 w-4" /> Konversi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b p-4">
                <h3 className="text-base font-semibold">{title}</h3>
                {action}
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
        </div>
    );
}

function IconRow({ icon: Icon, value }: { icon: any; value: string }) {
    return (
        <div className="flex items-start gap-2">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="break-all">{value}</span>
        </div>
    );
}

function ActivityDialog({ open, onClose, prospectId, activityTypes }: { open: boolean; onClose: () => void; prospectId: number; activityTypes: string[] }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        type: 'Telepon', subject: '', description: '', scheduled_at: '', status: 'Terjadwal', outcome: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/crm/prospek/${prospectId}/aktivitas`, { preserveScroll: true, onSuccess: () => { reset(); onClose(); } });
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>Tambah Aktivitas</DialogTitle><DialogDescription>Catat komunikasi atau jadwalkan follow-up.</DialogDescription></DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Jenis</Label>
                            <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>{activityTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Terjadwal">Terjadwal</SelectItem>
                                    <SelectItem value="Selesai">Selesai</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Subjek *</Label>
                        <Input value={data.subject} onChange={(e) => setData('subject', e.target.value)} required />
                        {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label>Jadwal / Waktu</Label>
                        <Input type="datetime-local" value={data.scheduled_at} onChange={(e) => setData('scheduled_at', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Deskripsi</Label>
                        <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={2} />
                    </div>
                    {data.status === 'Selesai' && (
                        <div className="space-y-1.5">
                            <Label>Hasil</Label>
                            <Textarea value={data.outcome} onChange={(e) => setData('outcome', e.target.value)} rows={2} />
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>Simpan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditProspectDialog({ open, onClose, prospect, options, needFields }: { open: boolean; onClose: () => void; prospect: any; options: any; needFields: Record<string, string> }) {
    const { data, setData, put, processing } = useForm({
        company_name: prospect.company_name || '', brand_name: prospect.brand_name || '', company_type: prospect.company_type || '',
        industry: prospect.industry || '', address: prospect.address || '', city: prospect.city || '', province: prospect.province || '',
        country: prospect.country || 'Indonesia', website: prospect.website || '', company_email: prospect.company_email || '',
        company_phone: prospect.company_phone || '', company_whatsapp: prospect.company_whatsapp || '',
        pic_name: prospect.pic_name || '', pic_position: prospect.pic_position || '', pic_email: prospect.pic_email || '',
        pic_phone: prospect.pic_phone || '', pic_whatsapp: prospect.pic_whatsapp || '', pic_linkedin: prospect.pic_linkedin || '',
        source: prospect.source || '', sales_id: prospect.sales_id ? String(prospect.sales_id) : '', priority: prospect.priority || 'Sedang',
        products_interest: prospect.products_interest || '', notes: prospect.notes || '',
        estimated_value: prospect.estimated_value || '', expected_close_date: prospect.expected_close_date ? prospect.expected_close_date.split('T')[0] : '',
        next_action: prospect.next_action || '', next_follow_up_at: prospect.next_follow_up_at ? prospect.next_follow_up_at.substring(0, 16) : '',
        needs: { ...(prospect.needs || {}) } as Record<string, string>,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/crm/prospek/${prospect.id}`, { preserveScroll: true, onSuccess: () => onClose() });
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                <DialogHeader><DialogTitle>Edit Prospek</DialogTitle><DialogDescription>Lengkapi informasi perusahaan, kebutuhan, dan opportunity.</DialogDescription></DialogHeader>
                <form onSubmit={submit} className="space-y-5">
                    <fieldset className="space-y-3">
                        <legend className="text-sm font-semibold">Perusahaan</legend>
                        <div className="grid grid-cols-2 gap-3">
                            <L label="Nama Perusahaan"><Input value={data.company_name} onChange={(e) => setData('company_name', e.target.value)} /></L>
                            <L label="Brand"><Input value={data.brand_name} onChange={(e) => setData('brand_name', e.target.value)} /></L>
                            <L label="Industri"><Input value={data.industry} onChange={(e) => setData('industry', e.target.value)} /></L>
                            <L label="Website"><Input value={data.website} onChange={(e) => setData('website', e.target.value)} /></L>
                            <L label="Alamat"><Input value={data.address} onChange={(e) => setData('address', e.target.value)} /></L>
                            <L label="Kota"><Input value={data.city} onChange={(e) => setData('city', e.target.value)} /></L>
                            <L label="Telepon"><Input value={data.company_phone} onChange={(e) => setData('company_phone', e.target.value)} /></L>
                            <L label="Email"><Input value={data.company_email} onChange={(e) => setData('company_email', e.target.value)} /></L>
                        </div>
                    </fieldset>

                    <fieldset className="space-y-3">
                        <legend className="text-sm font-semibold">PIC & Sales</legend>
                        <div className="grid grid-cols-2 gap-3">
                            <L label="Nama PIC"><Input value={data.pic_name} onChange={(e) => setData('pic_name', e.target.value)} /></L>
                            <L label="Jabatan"><Input value={data.pic_position} onChange={(e) => setData('pic_position', e.target.value)} /></L>
                            <L label="Telepon PIC"><Input value={data.pic_phone} onChange={(e) => setData('pic_phone', e.target.value)} /></L>
                            <L label="WhatsApp PIC"><Input value={data.pic_whatsapp} onChange={(e) => setData('pic_whatsapp', e.target.value)} /></L>
                            <L label="Email PIC"><Input value={data.pic_email} onChange={(e) => setData('pic_email', e.target.value)} /></L>
                            <L label="LinkedIn"><Input value={data.pic_linkedin} onChange={(e) => setData('pic_linkedin', e.target.value)} /></L>
                            <L label="Sumber">
                                <Select value={data.source || ALL} onValueChange={(v) => setData('source', v === ALL ? '' : v)}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Pilih" /></SelectTrigger>
                                    <SelectContent><SelectItem value={ALL}>-</SelectItem>{options.sources.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                </Select>
                            </L>
                            <L label="Sales">
                                <Select value={data.sales_id || ALL} onValueChange={(v) => setData('sales_id', v === ALL ? '' : v)}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Pilih" /></SelectTrigger>
                                    <SelectContent><SelectItem value={ALL}>-</SelectItem>{options.sales.map((s: any) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </L>
                            <L label="Prioritas">
                                <Select value={data.priority} onValueChange={(v) => setData('priority', v)}>
                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>{options.priorities.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                </Select>
                            </L>
                            <L label="Produk/Layanan Diminati"><Input value={data.products_interest} onChange={(e) => setData('products_interest', e.target.value)} /></L>
                        </div>
                    </fieldset>

                    <fieldset className="space-y-3">
                        <legend className="text-sm font-semibold">Opportunity & Next Action</legend>
                        <div className="grid grid-cols-2 gap-3">
                            <L label="Nilai Peluang (Rp)"><Input type="number" value={data.estimated_value} onChange={(e) => setData('estimated_value', e.target.value)} /></L>
                            <L label="Target Closing"><Input type="date" value={data.expected_close_date} onChange={(e) => setData('expected_close_date', e.target.value)} /></L>
                            <L label="Next Action"><Input value={data.next_action} onChange={(e) => setData('next_action', e.target.value)} /></L>
                            <L label="Jadwal Follow-up"><Input type="datetime-local" value={data.next_follow_up_at} onChange={(e) => setData('next_follow_up_at', e.target.value)} /></L>
                        </div>
                    </fieldset>

                    <fieldset className="space-y-3">
                        <legend className="text-sm font-semibold">Kebutuhan</legend>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(needFields).map(([key, label]) => (
                                <L key={key} label={label}>
                                    <Input value={data.needs[key] || ''} onChange={(e) => setData('needs', { ...data.needs, [key]: e.target.value })} />
                                </L>
                            ))}
                        </div>
                    </fieldset>

                    <L label="Catatan"><Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={2} /></L>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>Simpan Perubahan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
    return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}

ProspectShow.layout = {
    breadcrumbs: [{ title: 'CRM', href: '/crm' }, { title: 'Prospek', href: '/crm/prospek' }],
};
