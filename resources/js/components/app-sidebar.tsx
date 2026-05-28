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

const dashboardNav: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
];

const operationsNav: NavItem[] = [
    { title: 'Calendar', href: '/calendar', icon: Calendar },
    { title: 'Projects', href: '/projects', icon: Briefcase },
    { title: 'Tasks', href: '/tasks', icon: ListTodo },
    { title: 'Clients', href: '/clients', icon: Building2 },
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

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const userRole = auth.user?.role || 'staff';

    const isStaff = userRole === 'staff';
    const isAdminOp = userRole === 'admin_operasional';
    const isAdmin = userRole === 'admin';

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
                <NavMain items={operationsNav} label="Operations" />
                
                {(isAdmin || isAdminOp) && (
                    <NavMain items={financeNav} label="Finance" />
                )}
                
                <NavMain items={marketingNav} label="Marketing" />
                
                {(isAdmin || isAdminOp) && (
                    <NavMain items={administrationNav} label="Administration" />
                )}
                
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
