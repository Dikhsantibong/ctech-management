import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, FileText, Printer, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function InvoiceShow({ invoice }: { invoice: any }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    const statusBadgeColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'default';
            case 'Sent': return 'secondary';
            case 'Overdue': return 'destructive';
            default: return 'outline';
        }
    };

    const updateStatus = (newStatus: string) => {
        router.put(`/invoices/${invoice.id}/status`, { status: newStatus }, { preserveScroll: true });
    };

    return (
        <>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/invoices">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold tracking-tight">{invoice.invoice_number}</h2>
                                <Badge variant={statusBadgeColor(invoice.status)}>
                                    {invoice.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-1">
                                For {invoice.client_name}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-32">
                            <Select value={invoice.status} onValueChange={updateStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Sent">Sent</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Overdue">Overdue</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button asChild>
                            <a href={`/invoices/${invoice.id}/pdf`} target="_blank" rel="noopener noreferrer">
                                <Eye className="mr-2 h-4 w-4" /> Preview PDF
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Invoice Items</CardTitle>
                                    <CardDescription>Line items and pricing details.</CardDescription>
                                </div>
                                <FileText className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Description</th>
                                                <th className="h-10 px-4 text-center font-medium text-muted-foreground w-20">Qty</th>
                                                <th className="h-10 px-4 text-right font-medium text-muted-foreground w-32">Price</th>
                                                <th className="h-10 px-4 text-right font-medium text-muted-foreground w-32">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoice.items.map((item: any) => (
                                                <tr key={item.id} className="border-b">
                                                    <td className="p-4">{item.description}</td>
                                                    <td className="p-4 text-center">{item.quantity}</td>
                                                    <td className="p-4 text-right">{formatCurrency(item.price)}</td>
                                                    <td className="p-4 text-right font-medium">{formatCurrency(item.total)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-b bg-muted/20">
                                                <td colSpan={3} className="p-3 text-right font-medium text-muted-foreground">Subtotal</td>
                                                <td className="p-3 text-right font-medium">{formatCurrency(invoice.subtotal)}</td>
                                            </tr>
                                            <tr className="border-b bg-muted/20">
                                                <td colSpan={3} className="p-3 text-right font-medium text-muted-foreground">Tax</td>
                                                <td className="p-3 text-right font-medium">{formatCurrency(invoice.tax)}</td>
                                            </tr>
                                            <tr className="bg-muted/50">
                                                <td colSpan={3} className="p-4 text-right font-bold">Grand Total</td>
                                                <td className="p-4 text-right font-bold text-lg">{formatCurrency(invoice.total)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                                    <p className="font-medium">{invoice.invoice_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Client Name</p>
                                    <p className="font-medium">{invoice.client_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Date Issued</p>
                                    <p className="font-medium">{new Date(invoice.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                                    <p className="font-medium text-destructive">{new Date(invoice.due_date).toLocaleDateString()}</p>
                                </div>
                                {invoice.status === 'Paid' && (
                                    <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border border-green-200 dark:border-green-900">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-medium">Payment Received</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

InvoiceShow.layout = {
    breadcrumbs: [
        {
            title: 'Invoices',
            href: '/invoices',
        },
        {
            title: 'Invoice Details',
            href: '#',
        },
    ],
};
