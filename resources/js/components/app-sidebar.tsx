import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Briefcase, ListTodo, Receipt, Mail, MailOpen, FileStack, Files, Users, Activity, Settings, Megaphone, Building2, Calendar, Newspaper, Bell, ClipboardList } from 'lucide-react';
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

const dashboardNav: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
];

const announcementsNav: NavItem[] = [
    { title: 'Pengumuman', href: '/announcements', icon: Bell },
];

const operationsNav: NavItem[] = [
    { title: 'Calendar', href: '/calendar', icon: Calendar },
    { title: 'Projects', href: '/projects', icon: Briefcase },
    { title: 'Tasks', href: '/tasks', icon: ListTodo },
    { title: 'Work', href: '/works', icon: ClipboardList },
    { title: 'Daily Reports', href: '/daily-reports', icon: FileStack },
];

const financeNav: NavItem[] = [
    { title: 'Invoices', href: '/invoices', icon: Receipt },
];

const administrationNav: NavItem[] = [
    { title: 'Surat Keluar', href: '/letters', icon: Mail },
    { title: 'Surat Masuk', href: '/incoming-letters', icon: MailOpen },
    { title: 'Documents', href: '/documents', icon: FileStack },
    { title: 'Files', href: '/files', icon: Files },
];

const marketingNav: NavItem[] = [
    { title: 'Berita', href: '/news', icon: Newspaper },
    { title: 'Portfolio', href: '/portfolios', icon: Briefcase },
    { title: 'Content Planning', href: '/content-plans', icon: Megaphone },
];

const systemNav: NavItem[] = [
    { title: 'Team', href: '/users', icon: Users },
    { title: 'Activity Logs', href: '/activity-logs', icon: Activity },
    { title: 'Settings', href: '/settings', icon: Settings },
];

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const userRole = auth.user?.role || 'operation';

    const isOperation = userRole === 'operation';
    const isMarketing = userRole === 'marketing';
    const isAdministrasi = userRole === 'administrasi';
    const isDirekturUtama = userRole === 'direktur_utama';

    const currentOperationsNav = [...operationsNav];
    if (isDirekturUtama || isMarketing || isOperation) {
        currentOperationsNav.push({ title: 'Clients', href: '/clients', icon: Building2 });
    }

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
                
                {(isDirekturUtama || isOperation) && (
                    <NavMain items={currentOperationsNav} label="Operations" />
                )}

                {(isDirekturUtama || isAdministrasi) && (
                    <NavMain items={financeNav} label="Finance" />
                )}

                {(isDirekturUtama || isMarketing) && (
                    <NavMain items={marketingNav} label="Marketing" />
                )}

                {(isDirekturUtama || isAdministrasi) && (
                    <NavMain items={administrationNav} label="Administration" />
                )}

                {isDirekturUtama && (
                    <NavMain items={systemNav} label="System" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
