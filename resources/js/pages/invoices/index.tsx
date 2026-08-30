import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreVertical, FileText, Trash2, Eye, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function InvoicesIndex({ invoices }: { invoices: any[] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        client_name: '',
        due_date: '',
        use_tax: true,
        tax_rate: 11, // Default to 11% tax
        items: [{ id: null, description: '', quantity: 1, price: 0 }] as any[]
    });

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (invoice: any) => {
        setSelectedInvoice(invoice);
        
        let taxRate = 0;
        if (invoice.subtotal > 0) {
            taxRate = Math.round((invoice.tax / invoice.subtotal) * 100);
        }

        setData({
            client_name: invoice.client_name,
            due_date: invoice.due_date ? invoice.due_date.split('T')[0] : '',
            use_tax: parseFloat(invoice.tax) > 0,
            tax_rate: taxRate > 0 ? taxRate : 11,
            items: invoice.items && invoice.items.length > 0 ? invoice.items.map((item: any) => ({
                id: item.id,
                description: item.description,
                quantity: item.quantity,
                price: parseFloat(item.price)
            })) : [{ id: null, description: '', quantity: 1, price: 0 }]
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (invoice: any) => {
        setSelectedInvoice(invoice);
        setIsDeleteModalOpen(true);
    };

    const addItem = () => {
        setData('items', [...data.items, { id: null, description: '', quantity: 1, price: 0 }]);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const removeItem = (index: number) => {
        if (data.items.length > 1) {
            const newItems = [...data.items];
            newItems.splice(index, 1);
            setData('items', newItems);
        }
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/invoices', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/invoices/${selectedInvoice?.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/invoices/${selectedInvoice?.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    // Live calculation for create form
    const computedSubtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const computedTax = data.use_tax ? computedSubtotal * ((data.tax_rate || 0) / 100) : 0;
    const computedTotal = computedSubtotal + computedTax;

    const statusBadgeColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'default';
            case 'Sent': return 'secondary';
            case 'Overdue': return 'destructive';
            default: return 'outline'; // Draft
        }
    };

    return (
        <>
            <Head title="Invoices" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
                        <p className="text-muted-foreground">Manage billing and automatically generate PDF invoices.</p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" /> Create Invoice
                    </Button>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Invoice Number</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Due Date</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">
                                                <Link href={`/invoices/${invoice.id}`} className="hover:underline flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    {invoice.invoice_number}
                                                </Link>
                                            </td>
                                            <td className="p-4 align-middle">{invoice.client_name}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={statusBadgeColor(invoice.status)}>
                                                    {invoice.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(invoice.due_date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle text-right font-medium">
                                                {formatCurrency(invoice.total)}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/invoices/${invoice.id}`} className="cursor-pointer">
                                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEditModal(invoice)}>
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a href={`/invoices/${invoice.id}/pdf`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                                                <Eye className="mr-2 h-4 w-4" /> Preview PDF
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a href={`/invoices/${invoice.id}/kwitansi`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                                                <FileText className="mr-2 h-4 w-4" /> Cetak Kwitansi
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openDeleteModal(invoice)} className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                    {invoices.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                No invoices found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Create Invoice</DialogTitle>
                        <DialogDescription>Fill in the client details and add line items.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="client_name">Client Name</Label>
                                <Input id="client_name" value={data.client_name} onChange={e => setData('client_name', e.target.value)} required />
                                {errors.client_name && <p className="text-sm text-destructive">{errors.client_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="due_date">Due Date</Label>
                                <Input id="due_date" type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} required />
                                {errors.due_date && <p className="text-sm text-destructive">{errors.due_date}</p>}
                            </div>
                            <div className="col-span-2 flex items-center justify-between rounded-md border p-3">
                                <div className="space-y-0.5">
                                    <Label htmlFor="use_tax">Gunakan Pajak (PPN)</Label>
                                    <p className="text-xs text-muted-foreground">Aktifkan jika invoice ini dikenakan pajak.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {data.use_tax && (
                                        <div className="flex items-center gap-1">
                                            <Input id="tax_rate" type="number" min="0" max="100" className="w-20 text-right" value={data.tax_rate} onChange={e => setData('tax_rate', parseFloat(e.target.value))} required />
                                            <span className="text-sm text-muted-foreground">%</span>
                                        </div>
                                    )}
                                    <Switch id="use_tax" checked={data.use_tax} onCheckedChange={checked => setData('use_tax', checked)} />
                                </div>
                            </div>
                            {errors.tax_rate && <p className="col-span-2 text-sm text-destructive">{errors.tax_rate}</p>}
                        </div>

                        <div className="space-y-2 mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <Label>Invoice Items</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Item
                                </Button>
                            </div>
                            {data.items.map((item, index) => (
                                <div key={index} className="flex items-end gap-2 p-2 border rounded-md bg-muted/20">
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-xs">Description</Label>
                                        <Input value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} required />
                                    </div>
                                    <div className="w-24 space-y-1">
                                        <Label className="text-xs">Qty</Label>
                                        <Input type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', parseInt(e.target.value))} required />
                                    </div>
                                    <div className="w-32 space-y-1">
                                        <Label className="text-xs">Price (IDR)</Label>
                                        <Input type="number" min="0" value={item.price} onChange={e => updateItem(index, 'price', parseInt(e.target.value))} required />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive mb-0.5" onClick={() => removeItem(index)} disabled={data.items.length === 1}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}
                        </div>

                        {/* Live Calculation Summary */}
                        <div className="mt-4 rounded-lg border bg-muted/30 p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">{formatCurrency(computedSubtotal)}</span>
                            </div>
                            {data.use_tax && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Pajak ({data.tax_rate || 0}%)</span>
                                    <span className="font-medium">{formatCurrency(computedTax)}</span>
                                </div>
                            )}
                            <div className="border-t pt-2 flex justify-between text-base">
                                <span className="font-bold">Grand Total</span>
                                <span className="font-bold text-primary">{formatCurrency(computedTotal)}</span>
                            </div>
                        </div>
                        
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Generate Invoice</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit Invoice</DialogTitle>
                        <DialogDescription>Update the client details and line items.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_client_name">Client Name</Label>
                                <Input id="edit_client_name" value={data.client_name} onChange={e => setData('client_name', e.target.value)} required />
                                {errors.client_name && <p className="text-sm text-destructive">{errors.client_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_due_date">Due Date</Label>
                                <Input id="edit_due_date" type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} required />
                                {errors.due_date && <p className="text-sm text-destructive">{errors.due_date}</p>}
                            </div>
                            <div className="col-span-2 flex items-center justify-between rounded-md border p-3">
                                <div className="space-y-0.5">
                                    <Label htmlFor="edit_use_tax">Gunakan Pajak (PPN)</Label>
                                    <p className="text-xs text-muted-foreground">Aktifkan jika invoice ini dikenakan pajak.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {data.use_tax && (
                                        <div className="flex items-center gap-1">
                                            <Input id="edit_tax_rate" type="number" min="0" max="100" className="w-20 text-right" value={data.tax_rate} onChange={e => setData('tax_rate', parseFloat(e.target.value))} required />
                                            <span className="text-sm text-muted-foreground">%</span>
                                        </div>
                                    )}
                                    <Switch id="edit_use_tax" checked={data.use_tax} onCheckedChange={checked => setData('use_tax', checked)} />
                                </div>
                            </div>
                            {errors.tax_rate && <p className="col-span-2 text-sm text-destructive">{errors.tax_rate}</p>}
                        </div>

                        <div className="space-y-2 mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <Label>Invoice Items</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Item
                                </Button>
                            </div>
                            {data.items.map((item, index) => (
                                <div key={index} className="flex items-end gap-2 p-2 border rounded-md bg-muted/20">
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-xs">Description</Label>
                                        <Input value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} required />
                                    </div>
                                    <div className="w-24 space-y-1">
                                        <Label className="text-xs">Qty</Label>
                                        <Input type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', parseInt(e.target.value))} required />
                                    </div>
                                    <div className="w-32 space-y-1">
                                        <Label className="text-xs">Price (IDR)</Label>
                                        <Input type="number" min="0" value={item.price} onChange={e => updateItem(index, 'price', parseInt(e.target.value))} required />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive mb-0.5" onClick={() => removeItem(index)} disabled={data.items.length === 1}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}
                        </div>

                        {/* Live Calculation Summary */}
                        <div className="mt-4 rounded-lg border bg-muted/30 p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">{formatCurrency(computedSubtotal)}</span>
                            </div>
                            {data.use_tax && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Pajak ({data.tax_rate || 0}%)</span>
                                    <span className="font-medium">{formatCurrency(computedTax)}</span>
                                </div>
                            )}
                            <div className="border-t pt-2 flex justify-between text-base">
                                <span className="font-bold">Grand Total</span>
                                <span className="font-bold text-primary">{formatCurrency(computedTotal)}</span>
                            </div>
                        </div>
                        
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Update Invoice</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Invoice</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold">{selectedInvoice?.invoice_number}</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitDelete}>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="destructive" disabled={processing}>Delete</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

InvoicesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Invoices',
            href: '/invoices',
        },
    ],
};
