import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, MoreVertical, FileText, Trash2, Eye, Edit2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

export default function DocumentsIndex({ documents, filters }: { documents: any, filters?: any }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== (filters?.search || '')) {
                router.get('/documents', { search: searchQuery }, { preserveState: true, replace: true, preserveScroll: true });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        content: '',
    });

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (document: any) => {
        setSelectedDocument(document);
        setData({
            title: document.title,
            content: document.content || '',
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (document: any) => {
        setSelectedDocument(document);
        setIsDeleteModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/documents', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/documents/${selectedDocument?.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/documents/${selectedDocument?.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    return (
        <>
            <Head title="Documents" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Documents</h2>
                        <p className="text-muted-foreground">Internal company wiki and documentation.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Input 
                            placeholder="Cari dokumen..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[250px]"
                        />
                        <Button onClick={openCreateModal}>
                            <Plus className="mr-2 h-4 w-4" /> New Document
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {(documents.data || documents).map((document: any) => (
                        <div key={document.id} className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition-all hover:shadow-md">
                            <div className="absolute top-4 right-4 flex items-center gap-1 bg-card shadow-sm border rounded-md p-0.5">
                                <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); openEditModal(document); }} className="h-7 w-7 text-muted-foreground hover:text-primary">
                                    <Edit2 className="h-3.5 w-3.5" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); openDeleteModal(document); }} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                            
                            <Link href={`/documents/${document.id}`} className="block mb-4 pt-2">
                                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                                    {document.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-3">
                                    {document.content || 'No content provided.'}
                                </p>
                            </Link>

                            <div className="mt-auto border-t pt-4 flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted border border-background">
                                        {document.creator?.name.charAt(0)}
                                    </div>
                                    <span>{document.creator?.name}</span>
                                </div>
                                <span>{new Date(document.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                    ))}
                    {(documents.data || documents).length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                            <BookOpen className="mx-auto h-12 w-12 opacity-20 mb-3" />
                            <h3 className="font-semibold text-lg mb-1">No documents found</h3>
                            <p className="mb-4">Create your first company document or wiki page.</p>
                            <Button onClick={openCreateModal} variant="outline">
                                <Plus className="mr-2 h-4 w-4" /> New Document
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>New Document</DialogTitle>
                        <DialogDescription>Create a new wiki page or document.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} required placeholder="e.g. Employee Handbook" />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content (Markdown supported)</Label>
                            <Textarea 
                                id="content" 
                                className="min-h-[400px] font-mono" 
                                value={data.content} 
                                onChange={e => setData('content', e.target.value)} 
                                placeholder="# Heading 1&#10;&#10;Write your content here..." 
                            />
                            {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                        </div>
                        
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Save Document</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit Document</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input id="edit-title" value={data.title} onChange={e => setData('title', e.target.value)} required />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-content">Content (Markdown supported)</Label>
                            <Textarea 
                                id="edit-content" 
                                className="min-h-[400px] font-mono" 
                                value={data.content} 
                                onChange={e => setData('content', e.target.value)} 
                            />
                            {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                        </div>
                        
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Update Document</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Document</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold">{selectedDocument?.title}</span>? This action cannot be undone.
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

DocumentsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Documents',
            href: '/documents',
        },
    ],
};
