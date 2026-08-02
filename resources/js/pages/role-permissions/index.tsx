import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle, Crown, Users as UsersIcon, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

type Menu = {
    key: string;
    label: string;
    href: string;
    group: string;
    icon: string;
    sensitive: boolean;
    locked: boolean;
};

type Role = {
    value: string;
    label: string;
    allowed: string[];
    user_count: number;
};

export default function RolePermissionsIndex({
    menus,
    groups,
    roles,
    super_role_label,
    always_allowed,
}: {
    menus: Menu[];
    groups: string[];
    roles: Role[];
    super_role_label: string;
    always_allowed: string[];
}) {
    // Salinan lokal supaya perubahan bisa ditinjau dulu sebelum disimpan
    const [draft, setDraft] = useState<Record<string, string[]>>(() =>
        Object.fromEntries(roles.map((r) => [r.value, [...r.allowed]])),
    );
    const [saving, setSaving] = useState<string | null>(null);

    const original = useMemo(
        () => Object.fromEntries(roles.map((r) => [r.value, [...r.allowed].sort().join(',')])),
        [roles],
    );

    const isDirty = (role: string) => [...(draft[role] ?? [])].sort().join(',') !== original[role];

    const toggle = (role: string, menuKey: string) => {
        setDraft((prev) => {
            const current = prev[role] ?? [];
            return {
                ...prev,
                [role]: current.includes(menuKey) ? current.filter((k) => k !== menuKey) : [...current, menuKey],
            };
        });
    };

    const toggleGroup = (role: string, group: string, enable: boolean) => {
        const keys = menus.filter((m) => m.group === group && !m.locked).map((m) => m.key);
        setDraft((prev) => {
            const current = prev[role] ?? [];
            return {
                ...prev,
                [role]: enable ? Array.from(new Set([...current, ...keys])) : current.filter((k) => !keys.includes(k)),
            };
        });
    };

    const reset = (role: string) => {
        const source = roles.find((r) => r.value === role);
        setDraft((prev) => ({ ...prev, [role]: [...(source?.allowed ?? [])] }));
    };

    const save = (role: string) => {
        setSaving(role);
        router.put(
            '/role-permissions',
            { role, menu_keys: draft[role] ?? [] },
            {
                preserveScroll: true,
                onError: () => toast.error('Gagal menyimpan hak akses.'),
                onFinish: () => setSaving(null),
            },
        );
    };

    return (
        <>
            <Head title="Hak Akses Menu" />
            <div className="flex flex-1 flex-col gap-5 p-6">
                <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <ShieldCheck className="h-6 w-6 text-muted-foreground" /> Hak Akses Menu
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Tentukan menu apa saja yang bisa dibuka tiap role. Pengaturan ini juga mengunci alamat URL-nya, bukan sekadar
                        menyembunyikan menu dari sidebar.
                    </p>
                </div>

                {/* Catatan penting */}
                <div className="flex flex-col gap-2 rounded-xl border bg-muted/30 p-4 text-sm sm:flex-row sm:items-center sm:gap-6">
                    <span className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-amber-500" />
                        <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">{super_role_label}</span> selalu punya akses penuh
                        </span>
                    </span>
                    <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Dashboard, Pengumuman, dan Settings selalu terbuka untuk semua role
                        </span>
                    </span>
                </div>

                {/* Satu kartu per role */}
                <div className="grid gap-5 xl:grid-cols-3">
                    {roles.map((role) => {
                        const selected = draft[role.value] ?? [];
                        const dirty = isDirty(role.value);

                        return (
                            <div key={role.value} className="flex flex-col rounded-xl border bg-card shadow-sm">
                                <div className="flex items-start justify-between gap-3 border-b p-4">
                                    <div>
                                        <h3 className="font-semibold">{role.label}</h3>
                                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <UsersIcon className="h-3 w-3" />
                                            {role.user_count} pengguna · {selected.length} menu aktif
                                        </p>
                                    </div>
                                    {dirty && (
                                        <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                                            Belum disimpan
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4 p-4">
                                    {groups.map((group) => {
                                        const groupMenus = menus.filter((m) => m.group === group);
                                        if (groupMenus.length === 0) return null;

                                        const grantable = groupMenus.filter((m) => !m.locked);
                                        const allOn =
                                            grantable.length > 0 && grantable.every((m) => selected.includes(m.key));

                                        return (
                                            <div key={group}>
                                                <div className="mb-1.5 flex items-center justify-between">
                                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                                        {group}
                                                    </p>
                                                    {grantable.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleGroup(role.value, group, !allOn)}
                                                            className="text-[11px] font-medium text-primary hover:underline"
                                                        >
                                                            {allOn ? 'Kosongkan' : 'Pilih semua'}
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    {groupMenus.map((menu) => (
                                                        <label
                                                            key={menu.key}
                                                            className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${
                                                                menu.locked
                                                                    ? 'cursor-not-allowed bg-muted/40 opacity-70'
                                                                    : 'cursor-pointer hover:bg-muted/40'
                                                            }`}
                                                            title={menu.locked ? 'Menu ini khusus direktur utama' : menu.href}
                                                        >
                                                            <span className="flex min-w-0 items-center gap-2 text-sm">
                                                                {menu.locked && <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                                                                {menu.sensitive && !menu.locked && (
                                                                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                                                )}
                                                                <span className="truncate">{menu.label}</span>
                                                            </span>
                                                            <Switch
                                                                checked={menu.locked ? false : selected.includes(menu.key)}
                                                                disabled={menu.locked}
                                                                onCheckedChange={() => toggle(role.value, menu.key)}
                                                            />
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {selected.some((k) => menus.find((m) => m.key === k)?.sensitive) && (
                                        <p className="flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                            Role ini diberi menu sensitif. Menu Team memungkinkan mereka membuat dan mengubah pengguna
                                            lain, termasuk mengatur role-nya.
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t p-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => reset(role.value)}
                                        disabled={!dirty}
                                    >
                                        <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Batalkan
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => save(role.value)}
                                        disabled={!dirty || saving === role.value}
                                    >
                                        <Save className="mr-1.5 h-3.5 w-3.5" /> Simpan
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

RolePermissionsIndex.layout = {
    breadcrumbs: [{ title: 'Hak Akses Menu', href: '/role-permissions' }],
};
