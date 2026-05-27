import { Head, Link } from '@inertiajs/react';
import { Building2, Mail, Phone, User, ArrowLeft, FileText, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClientsShow({ client }: { client: any }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    const statusBadgeColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'default';
            case 'Paid': return 'default';
            case 'Progress': return 'secondary';
            case 'Sent': return 'secondary';
            case 'Review': return 'outline';
            case 'Overdue': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <>
            <Head title={`Client: ${client.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/clients">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                <Building2 className="h-6 w-6" />
                                {client.name}
                            </h2>
                            <p className="text-muted-foreground">Client details and history</p>
                        </div>
                    </div>
                </div>

                {/* Client Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Client Information</CardTitle>
                        <CardDescription>Basic contact details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">PIC (Person in Charge)</p>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">{client.pic || '-'}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Contact</p>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">{client.contact || '-'}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">{client.email || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Project History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LayoutTemplate className="h-5 w-5" />
                            Project History
                        </CardTitle>
                        <CardDescription>Projects associated with this client</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {client.projects && client.projects.length > 0 ? (
                            <div className="space-y-3">
                                {client.projects.map((project: any) => (
                                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                                        <div className="flex-1">
                                            <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                                                {project.project_name}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">{project.description || 'No description'}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant={statusBadgeColor(project.status)}>
                                                {project.status}
                                            </Badge>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(project.deadline).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No projects found for this client.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Invoice History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Invoice History
                        </CardTitle>
                        <CardDescription>Invoices associated with this client</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {client.invoices && client.invoices.length > 0 ? (
                            <div className="space-y-3">
                                {client.invoices.map((invoice: any) => (
                                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                                        <div className="flex-1">
                                            <Link href={`/invoices/${invoice.id}`} className="font-medium hover:underline flex items-center gap-2">
                                                {invoice.invoice_number}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant={statusBadgeColor(invoice.status)}>
                                                {invoice.status}
                                            </Badge>
                                            <p className="text-sm font-medium">{formatCurrency(invoice.total)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No invoices found for this client.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ClientsShow.layout = {
    breadcrumbs: [
        {
            title: 'Clients',
            href: '/clients',
        },
        {
            title: 'Client Details',
            href: '#',
        },
    ],
};
