import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid, Briefcase, ListTodo, Receipt, Mail, MailOpen, FileStack, Files, Users, Activity,
    Settings, Megaphone, Building2, Calendar, Newspaper, Bell, ClipboardList, Gauge, ShieldCheck, Share2, Circle,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

/** Nama ikon dikirim server sebagai string; dipetakan ke komponennya di sini. */
const ICONS: Record<string, any> = {
    LayoutGrid, Briefcase, ListTodo, Receipt, Mail, MailOpen, FileStack, Files, Users, Activity,
    Settings, Megaphone, Building2, Calendar, Newspaper, Bell, ClipboardList, Gauge, ShieldCheck, Share2,
};

/** Menu yang selalu tersedia untuk semua orang. */
const dashboardNav: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
];

const announcementsNav: NavItem[] = [
    { title: 'Pengumuman', href: '/announcements', icon: Bell },
];

type SharedMenuGroup = {
    group: string;
    items: { key: string; title: string; href: string; icon: string }[];
};

export function AppSidebar() {
    const { navMenus } = usePage<any>().props;

    // Hak akses ditentukan server (tabel role_menu_permissions), bukan pengecekan
    // role di frontend — jadi perubahan langsung berlaku tanpa build ulang.
    const groups: SharedMenuGroup[] = Array.isArray(navMenus) ? navMenus : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={dashboardNav} label="Overview" />
                <NavMain items={announcementsNav} label="Pengumuman" />

                {groups.map((group) => (
                    <NavMain
                        key={group.group}
                        label={group.group}
                        items={(group.items ?? []).map((item) => ({
                            title: item.title,
                            href: item.href,
                            icon: ICONS[item.icon] ?? Circle,
                        }))}
                    />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
