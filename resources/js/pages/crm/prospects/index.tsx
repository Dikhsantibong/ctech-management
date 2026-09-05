import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Plus, Search, Upload, Download, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDateTime, stageColor, priorityColor, statusColor } from '@/lib/crm';

interface Options {
    sales: { id: number; name: string }[];
    stages: string[]; sources: string[]; priorities: string[]; statuses: string[]; industries: string[];
}

const ALL = '__all__';

export default function ProspectsIndex({ prospects, filters, options }: { prospects: any; filters: any; options: Options }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const rows: any[] = prospects.data ?? [];

    useEffect(() => {
        const t = setTimeout(() => {
            if ((search || '') !== (filters.search || '')) {
                apply('search', search);
            }
        }, 350);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const apply = (key: string, value: string) => {
        const next = { ...filters, [key]: value === ALL ? '' : value };
        Object.keys(next).forEach((k) => { if (!next[k]) delete next[k]; });
        router.get('/crm/prospek', next, { preserveState: true, preserveScroll: true, replace: true });
    };

    const resetFilters = () => {
        setSearch('');
        router.get('/crm/prospek', {}, { preserveScroll: true });
    };

    const activeFilterCount = Object.keys(filters).filter((k) => k !== 'search' && filters[k]).length;

    const { data, setData, post, processing, errors, reset } = useForm({
        company_name: '', brand_name: '', industry: '', city: '',
        pic_name: '', pic_position: '', pic_phone: '', pic_whatsapp: '', pic_email: '',
        source: '', sales_id: '', priority: 'Sedang', products_interest: '', notes: '',
    });

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/crm/prospek', { onSuccess: () => { setIsCreateOpen(false); reset(); } });
    };

    return (
        <>
            <Head title="Prospek" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Prospek</h2>
                        <p className="text-muted-foreground">Database calon customer dan pipeline penjualan.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/crm/prospek/import"><Upload className="mr-2 h-4 w-4" /> Import Excel</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href={`/crm/prospek/export?${new URLSearchParams(filters as Record<string, string>).toString()}`}><Download className="mr-2 h-4 w-4" /> Export</a>
                        </Button>
                        <Button onClick={() => { reset(); setIsCreateOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Tambah Prospek</Button>
                    </div>
                </div>

                {/* Search + filter toggle */}
                <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Cari perusahaan, PIC, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setShowFilters((s) => !s)}>
                                <Filter className="mr-2 h-4 w-4" /> Filter {activeFilterCount > 0 && <Badge variant="secondary" className="ml-2">{activeFilterCount}</Badge>}
                            </Button>
                            {(activeFilterCount > 0 || filters.search) && (
                                <Button variant="ghost" size="sm" onClick={resetFilters}><X className="mr-1 h-4 w-4" /> Reset</Button>
                            )}
                        </div>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 gap-3 border-t pt-3 sm:grid-cols-2 lg:grid-cols-4">
                            <FilterSelect label="Sales" value={filters.sales_id} onChange={(v) => apply('sales_id', v)} options={options.sales.map((s) => ({ value: String(s.id), label: s.name }))} />
                            <FilterSelect label="Tahap" value={filters.stage} onChange={(v) => apply('stage', v)} options={options.stages.map((s) => ({ value: s, label: s }))} />
                            <FilterSelect label="Industri" value={filters.industry} onChange={(v) => apply('industry', v)} options={options.industries.map((s) => ({ value: s, label: s }))} />
                            <FilterSelect label="Sumber" value={filters.source} onChange={(v) => apply('source', v)} options={options.sources.map((s) => ({ value: s, label: s }))} />
                            <FilterSelect label="Prioritas" value={filters.priority} onChange={(v) => apply('priority', v)} options={options.priorities.map((s) => ({ value: s, label: s }))} />
                            <FilterSelect label="Status" value={filters.status} onChange={(v) => apply('status', v)} options={options.statuses.map((s) => ({ value: s, label: s }))} />
                            <FilterSelect label="Follow-up" value={filters.follow_up} onChange={(v) => apply('follow_up', v)} options={[{ value: 'today', label: 'Hari Ini' }, { value: 'overdue', label: 'Terlambat' }, { value: 'none', label: 'Tanpa Next Action' }]} />
                            <div className="space-y-1.5">
                                <Label className="text-xs">Kota</Label>
                                <Input defaultValue={filters.city} placeholder="Kota" onBlur={(e) => apply('city', e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-muted-foreground">
                                    {['Perusahaan', 'PIC', 'Jabatan', 'Industri', 'Produk/Layanan', 'Sumber', 'Sales', 'Tahap', 'Prioritas', 'Aktivitas Terakhir', 'Follow-up', 'Status'].map((h) => (
                                        <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((p) => (
                                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                                        <td className="whitespace-nowrap px-4 py-2.5">
                                            <Link href={`/crm/prospek/${p.id}`} className="font-medium hover:underline">{p.company_name}</Link>
                                            {p.brand_name && <div className="text-xs text-muted-foreground">{p.brand_name}</div>}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2.5">{p.pic_name ?? '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{p.pic_position ?? '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-2.5">{p.industry ?? '-'}</td>
                                        <td className="max-w-[180px] truncate px-4 py-2.5" title={p.products_interest ?? ''}>{p.products_interest ?? '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-2.5">{p.source ?? '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-2.5">{p.sales?.name ?? '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-2.5"><Badge variant="outline" className={stageColor(p.stage)}>{p.stage}</Badge></td>
                                        <td className="whitespace-nowrap px-4 py-2.5"><Badge variant="outline" className={priorityColor(p.priority)}>{p.priority}</Badge></td>
                                        <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{p.last_activity_at ? formatDateTime(p.last_activity_at) : '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-2.5">
                                            <span className={p.status === 'Aktif' && p.next_follow_up_at && new Date(p.next_follow_up_at) < new Date() ? 'text-rose-600' : 'text-muted-foreground'}>
                                                {p.next_follow_up_at ? formatDateTime(p.next_follow_up_at) : '-'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2.5"><Badge variant="outline" className={statusColor(p.status)}>{p.status}</Badge></td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr><td colSpan={12} className="px-4 py-10 text-center text-muted-foreground">Belum ada prospek. Tambahkan atau import dari Excel.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {prospects.last_page > 1 && (
                        <div className="flex items-center justify-between border-t p-3 text-sm">
                            <span className="text-muted-foreground">Menampilkan {prospects.from}-{prospects.to} dari {prospects.total}</span>
                            <div className="flex gap-1">
                                {prospects.links.map((link: any, i: number) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                        className={`min-w-8 rounded-md border px-2.5 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'} ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create modal - progressive disclosure: hanya info dasar */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Tambah Prospek</DialogTitle>
                        <DialogDescription>Cukup isi informasi dasar. Detail kebutuhan & opportunity dilengkapi kemudian.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Nama Perusahaan *" error={errors.company_name}>
                                <Input value={data.company_name} onChange={(e) => setData('company_name', e.target.value)} required />
                            </Field>
                            <Field label="Brand"><Input value={data.brand_name} onChange={(e) => setData('brand_name', e.target.value)} /></Field>
                            <Field label="Industri">
                                <Select value={data.industry || ALL} onValueChange={(v) => setData('industry', v === ALL ? '' : v)}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Pilih industri" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ALL}>-</SelectItem>
                                        {options.industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Kota"><Input value={data.city} onChange={(e) => setData('city', e.target.value)} /></Field>
                            <Field label="Nama PIC"><Input value={data.pic_name} onChange={(e) => setData('pic_name', e.target.value)} /></Field>
                            <Field label="Jabatan PIC"><Input value={data.pic_position} onChange={(e) => setData('pic_position', e.target.value)} /></Field>
                            <Field label="Telepon PIC"><Input value={data.pic_phone} onChange={(e) => setData('pic_phone', e.target.value)} /></Field>
                            <Field label="WhatsApp PIC"><Input value={data.pic_whatsapp} onChange={(e) => setData('pic_whatsapp', e.target.value)} /></Field>
                            <Field label="Email PIC" error={errors.pic_email}><Input type="email" value={data.pic_email} onChange={(e) => setData('pic_email', e.target.value)} /></Field>
                            <Field label="Sumber">
                                <Select value={data.source || ALL} onValueChange={(v) => setData('source', v === ALL ? '' : v)}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Pilih sumber" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ALL}>-</SelectItem>
                                        {options.sources.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Sales">
                                <Select value={data.sales_id || ALL} onValueChange={(v) => setData('sales_id', v === ALL ? '' : v)}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Pilih sales" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ALL}>Saya sendiri</SelectItem>
                                        {options.sales.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Prioritas">
                                <Select value={data.priority} onValueChange={(v) => setData('priority', v)}>
                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {options.priorities.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                        <Field label="Produk/Layanan yang Diminati"><Input value={data.products_interest} onChange={(e) => setData('products_interest', e.target.value)} /></Field>
                        <Field label="Catatan"><Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={2} /></Field>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan Prospek</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label>{label}</Label>
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value?: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs">{label}</Label>
            <Select value={value || ALL} onValueChange={onChange}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Semua" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL}>Semua</SelectItem>
                    {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    );
}

ProspectsIndex.layout = {
    breadcrumbs: [{ title: 'CRM', href: '/crm' }, { title: 'Prospek', href: '/crm/prospek' }],
};
