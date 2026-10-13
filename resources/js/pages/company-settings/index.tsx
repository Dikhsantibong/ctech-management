import { Head, useForm } from '@inertiajs/react';
import { Save, Building, User, CreditCard, MapPin, Phone, Mail, Globe, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type BankAccount = {
    bank_name: string;
    account_number: string;
    account_name: string;
    is_active: boolean;
};

const initialAccounts = (settings: any): BankAccount[] => {
    const stored = Array.isArray(settings?.bank_accounts) ? settings.bank_accounts : [];

    if (stored.length === 0) {
        // Data sebelum fitur multi rekening masih di kolom tunggal
        return [{
            bank_name: settings?.bank_name || '',
            account_number: settings?.bank_account_number || '',
            account_name: settings?.bank_account_name || '',
            is_active: true,
        }];
    }

    const hasActive = stored.some((b: any) => b.is_active);

    return stored.map((b: any, i: number) => ({
        bank_name: b.bank_name || '',
        account_number: b.account_number || '',
        account_name: b.account_name || '',
        is_active: hasActive ? Boolean(b.is_active) : i === 0,
    }));
};

export default function CompanySettingsIndex({ settings }: { settings: any }) {
    // Kolom tunggal bank_name dkk. tidak dikirim lagi — server mengisinya dari rekening utama
    const { data, setData, post, processing, errors } = useForm({
        company_name: settings?.company_name || '',
        leader_name: settings?.leader_name || '',
        bank_accounts: initialAccounts(settings),
        address: settings?.address || '',
        phone: settings?.phone || '',
        email: settings?.email || '',
        website: settings?.website || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings', { preserveScroll: true });
    };

    /** Perbarui satu rekening tanpa memutasi objek state lama. */
    const updateAccount = (index: number, field: keyof BankAccount, value: string) => {
        setData('bank_accounts', data.bank_accounts.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
    };

    const setPrimary = (index: number) => {
        setData('bank_accounts', data.bank_accounts.map((b, i) => ({ ...b, is_active: i === index })));
    };

    const removeAccount = (index: number) => {
        const remaining = data.bank_accounts.filter((_, i) => i !== index);
        const stillHasActive = remaining.some((b) => b.is_active);

        setData('bank_accounts', remaining.map((b, i) => ({ ...b, is_active: stillHasActive ? b.is_active : i === 0 })));
    };

    const activeAccount = data.bank_accounts.find((b) => b.is_active);

    return (
        <>
            <Head title="Company Settings" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">Company Settings</h2>
                    <p className="text-muted-foreground">Manage your company profile, billing details, and contact information used across the system.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Profile */}
                        <Card className="">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5 text-primary" />
                                    Informasi Perusahaan
                                </CardTitle>
                                <CardDescription>Data dasar perusahaan Anda.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_name">Nama Perusahaan</Label>
                                    <Input 
                                        id="company_name" 
                                        value={data.company_name} 
                                        onChange={e => setData('company_name', e.target.value)} 
                                        placeholder="PT C-Tech Solutions"
                                    />
                                    {errors.company_name && <p className="text-sm text-destructive">{errors.company_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="leader_name">Nama Pimpinan / Direktur</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            id="leader_name" 
                                            className="pl-9"
                                            value={data.leader_name} 
                                            onChange={e => setData('leader_name', e.target.value)} 
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    {errors.leader_name && <p className="text-sm text-destructive">{errors.leader_name}</p>}
                                </div>
                            </CardContent>
                        </Card>

                                                                        {/* Bank Details */}
                        <Card className="md:col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="space-y-1.5">
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        Informasi Rekening Bank
                                    </CardTitle>
                                    <CardDescription>Atur rekening bank Anda. Pilih salah satu sebagai rekening utama (aktif) yang akan dicetak di Invoice & Kwitansi.</CardDescription>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setData('bank_accounts', [...data.bank_accounts, { bank_name: '', account_number: '', account_name: '', is_active: data.bank_accounts.length === 0 }])}
                                    aria-label="Tambah rekening"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Tambah Rekening
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                {data.bank_accounts.map((bank, index) => (
                                    <div key={index} className={`space-y-4 p-4 border rounded-lg relative transition-all duration-200 ${bank.is_active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-slate-50/50 dark:bg-slate-900/50'}`}>
                                        
                                        <div className="absolute top-2 right-2 flex items-center gap-1">
                                            {bank.is_active ? (
                                                <span className="flex items-center text-xs font-medium text-primary mr-2 bg-primary/10 px-2 py-1 rounded-full">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Aktif Digunakan
                                                </span>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-xs h-7 mr-1"
                                                    onClick={() => setPrimary(index)}
                                                >
                                                    Jadikan Utama
                                                </Button>
                                            )}

                                            {data.bank_accounts.length > 1 && (
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => removeAccount(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="space-y-2 pr-20">
                                            <Label>Nama Bank</Label>
                                            <Input
                                                value={bank.bank_name}
                                                onChange={e => updateAccount(index, 'bank_name', e.target.value)}
                                                placeholder="BCA / Mandiri / BRI"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Nomor Rekening</Label>
                                            <Input
                                                value={bank.account_number}
                                                onChange={e => updateAccount(index, 'account_number', e.target.value)}
                                                placeholder="1234567890"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Atas Nama</Label>
                                            <Input
                                                value={bank.account_name}
                                                onChange={e => updateAccount(index, 'account_name', e.target.value)}
                                                placeholder="PT C-Tech Solutions"
                                            />
                                        </div>
                                    </div>
                                ))}
                                </div>

                                {/* Pratinjau yang akan tercetak di dokumen */}
                                <div className="mt-4 rounded-lg border bg-muted/30 p-3 text-sm">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Tercetak di Invoice & Kwitansi
                                    </p>
                                    {activeAccount && (activeAccount.bank_name || activeAccount.account_number) ? (
                                        <p className="mt-1">
                                            <span className="font-semibold">{activeAccount.bank_name || '-'}</span>
                                            {' · '}
                                            {activeAccount.account_number || '-'}
                                            {' · a.n. '}
                                            {activeAccount.account_name || '-'}
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-muted-foreground">Rekening utama belum diisi.</p>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Berlaku untuk dokumen yang diunduh setelah pengaturan disimpan.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Kontak & Alamat
                                </CardTitle>
                                <CardDescription>Informasi kontak resmi perusahaan.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address">Alamat Lengkap</Label>
                                        <Textarea 
                                            id="address" 
                                            value={data.address} 
                                            onChange={e => setData('address', e.target.value)} 
                                            placeholder="Gedung C-Tech Lantai 5, Jl. Teknologi No. 99, Jakarta Selatan"
                                            className="min-h-[100px]"
                                        />
                                        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telepon / WhatsApp</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="phone" 
                                                className="pl-9"
                                                value={data.phone} 
                                                onChange={e => setData('phone', e.target.value)} 
                                                placeholder="(021) 1234567"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Perusahaan</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="email" 
                                                type="email"
                                                className="pl-9"
                                                value={data.email} 
                                                onChange={e => setData('email', e.target.value)} 
                                                placeholder="info@ctech.com"
                                            />
                                        </div>
                                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="website">Website</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="website" 
                                                className="pl-9"
                                                value={data.website} 
                                                onChange={e => setData('website', e.target.value)} 
                                                placeholder="www.ctech.com"
                                            />
                                        </div>
                                        {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button type="submit" disabled={processing} size="lg" className="w-full md:w-auto">
                            <Save className="mr-2 h-4 w-4" />
                            Simpan Pengaturan
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CompanySettingsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Company Settings',
            href: '/settings',
        },
    ],
};

