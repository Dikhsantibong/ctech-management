import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Briefcase, ListTodo, Receipt, Mail, FileStack, Files, Users, Activity, Settings, Megaphone, Building2, Calendar } from 'lucide-react';
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

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const role = auth?.user?.role || 'staf';

    const dashboardNav: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    ];

    const operationsNav: NavItem[] = [
        ...(role !== 'staf' ? [{ title: 'Calendar', href: '/calendar', icon: Calendar }] : []),
        ...(role !== 'staf' ? [{ title: 'Projects', href: '/projects', icon: Briefcase }] : []),
        { title: 'Tasks', href: '/tasks', icon: ListTodo }, // Staf can see tasks
        ...(role !== 'staf' ? [{ title: 'Clients', href: '/clients', icon: Building2 }] : []),
    ];

    const financeNav: NavItem[] = [
        { title: 'Invoices', href: '/invoices', icon: Receipt },
    ];

    const administrationNav: NavItem[] = [
        { title: 'Letters', href: '/letters', icon: Mail },
        { title: 'Documents', href: '/documents', icon: FileStack },
        { title: 'Files', href: '/files', icon: Files },
    ];

    const marketingNav: NavItem[] = [
        { title: 'Content Planning', href: '/content-plans', icon: Megaphone },
    ];

    const systemNav: NavItem[] = [
        { title: 'Team', href: '/users', icon: Users },
        { title: 'Activity Logs', href: '/activity-logs', icon: Activity },
        { title: 'Settings', href: '/settings', icon: Settings },
    ];

    const isStaf = role === 'staf';
    const isAdminOperasional = role === 'admin_operasional' || role === 'admin_operational';
    const isAdmin = role === 'admin' || role === 'superadmin' || (!isStaf && !isAdminOperasional);

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
                
                {operationsNav.length > 0 && (
                    <NavMain items={operationsNav} label="Operations" />
                )}
                
                {/* Finance is for Admin & Admin Operasional */}
                {!isStaf && (
                    <NavMain items={financeNav} label="Finance" />
                )}

                {/* Marketing is for everyone (Staf needs Content Planning) */}
                <NavMain items={marketingNav} label="Marketing" />

                {/* Administration is for Admin & Admin Operasional */}
                {!isStaf && (
                    <NavMain items={administrationNav} label="Administration" />
                )}

                {/* System is only for Admin */}
                {isAdmin && (
                    <NavMain items={systemNav} label="System" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
