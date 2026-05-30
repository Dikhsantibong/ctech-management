import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function AnnouncementCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        visible_to_roles: ['staff', 'admin_operasional', 'direktur_operasional', 'direktur_utama'],
        type: 'info',
        is_active: true,
        published_at: '',
        expires_at: '',
    });

    const roles = [
        { value: 'staff', label: 'Staff' },
        { value: 'admin_operasional', label: 'Admin Operasional' },
        { value: 'direktur_operasional', label: 'Direktur Operasional' },
        { value: 'direktur_utama', label: 'Direktur Utama' },
    ];

    const handleRoleToggle = (role: string) => {
        setData('visible_to_roles',
            data.visible_to_roles.includes(role)
                ? data.visible_to_roles.filter(r => r !== role)
                : [...data.visible_to_roles, role]
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/announcements');
    };

    return (
        <>
            <Head title="Buat Pengumuman" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Buat Pengumuman Baru</h2>
                    <p className="text-muted-foreground">Buat pengumuman untuk tim Anda.</p>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Masukkan judul pengumuman"
                                required
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Konten</Label>
                            <Textarea
                                id="content"
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                placeholder="Masukkan konten pengumuman"
                                rows={6}
                                required
                            />
                            {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Tipe</Label>
                            <Select value={data.type} onValueChange={value => setData('type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="info">Info</SelectItem>
                                    <SelectItem value="warning">Warning</SelectItem>
                                    <SelectItem value="success">Success</SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Visible To Roles</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {roles.map((role) => (
                                    <div key={role.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={role.value}
                                            checked={data.visible_to_roles.includes(role.value)}
                                            onCheckedChange={() => handleRoleToggle(role.value)}
                                        />
                                        <Label htmlFor={role.value} className="cursor-pointer">
                                            {role.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {errors.visible_to_roles && <p className="text-sm text-destructive">{errors.visible_to_roles}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="published_at">Tanggal Publish (Opsional)</Label>
                            <Input
                                id="published_at"
                                type="datetime-local"
                                value={data.published_at}
                                onChange={e => setData('published_at', e.target.value)}
                            />
                            {errors.published_at && <p className="text-sm text-destructive">{errors.published_at}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expires_at">Tanggal Expire (Opsional)</Label>
                            <Input
                                id="expires_at"
                                type="datetime-local"
                                value={data.expires_at}
                                onChange={e => setData('expires_at', e.target.value)}
                            />
                            {errors.expires_at && <p className="text-sm text-destructive">{errors.expires_at}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                            />
                            <Label htmlFor="is_active" className="cursor-pointer">
                                Aktif
                            </Label>
                        </div>

                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

AnnouncementCreate.layout = {
    breadcrumbs: [
        {
            title: 'Pengumuman',
            href: '/announcements',
        },
        {
            title: 'Buat',
            href: '/announcements/create',
        },
    ],
};
