import { Head, useForm, router } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';
import { Plus, MoreVertical, File, FileText, Image as ImageIcon, FileArchive, Trash2, Download, Folder, FolderOpen, ArrowLeft, UploadCloud, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type FolderKey = 'general' | number;

export default function FilesIndex({ files, clients }: { files: any[]; clients: any[] }) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [activeFolder, setActiveFolder] = useState<FolderKey | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        files: [] as globalThis.File[],
        client_id: '' as string,
    });

    const folderCounts = useMemo(() => {
        const counts: Record<string, number> = { general: 0 };
        for (const f of files) {
            const key = f.client_id ? String(f.client_id) : 'general';
            counts[key] = (counts[key] || 0) + 1;
        }
        return counts;
    }, [files]);

    const visibleFiles = useMemo(() => {
        if (activeFolder === null) return [];
        if (activeFolder === 'general') return files.filter(f => !f.client_id);
        return files.filter(f => f.client_id === activeFolder);
    }, [files, activeFolder]);

    const activeFolderName = activeFolder === 'general'
        ? 'Umum'
        : clients.find(c => c.id === activeFolder)?.name ?? '';

    const openUploadModal = () => {
        reset();
        // Preselect folder yang sedang dibuka
        setData({
            files: [],
            client_id: activeFolder && activeFolder !== 'general' ? String(activeFolder) : '',
        });
        setIsUploadModalOpen(true);
    };

    const openDeleteModal = (file: any) => {
        setSelectedFile(file);
        setIsDeleteModalOpen(true);
    };

    const addFiles = (incoming: FileList | null) => {
        if (!incoming || incoming.length === 0) return;
        setData('files', [...data.files, ...Array.from(incoming)]);
    };

    const removeFile = (index: number) => {
        setData('files', data.files.filter((_, i) => i !== index));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const submitUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post('/files', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setIsUploadModalOpen(false);
                reset();
            },
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(`/files/${selectedFile?.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const getFileIcon = (extension: string) => {
        const ext = (extension || '').toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
            return <ImageIcon className="h-10 w-10 text-blue-500" />;
        }
        if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
            return <FileText className="h-10 w-10 text-orange-500" />;
        }
        if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) {
            return <FileArchive className="h-10 w-10 text-red-500" />;
        }
        return <File className="h-10 w-10 text-gray-500" />;
    };

    return (
        <>
            <Head title="Files & Assets" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {activeFolder !== null && (
                            <Button variant="outline" size="icon" onClick={() => setActiveFolder(null)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                {activeFolder === null ? 'Files & Assets' : `Folder: ${activeFolderName}`}
                            </h2>
                            <p className="text-muted-foreground flex items-center gap-1.5">
                                {activeFolder === null ? (
                                    <>
                                        <ShieldCheck className="h-4 w-4 text-green-600" />
                                        Dokumen tersimpan privat — hanya bisa diakses setelah login.
                                    </>
                                ) : (
                                    `${visibleFiles.length} file dalam folder ini.`
                                )}
                            </p>
                        </div>
                    </div>
                    <Button onClick={openUploadModal}>
                        <Plus className="mr-2 h-4 w-4" /> Upload File
                    </Button>
                </div>

                {activeFolder === null ? (
                    /* ===== Tampilan folder per client ===== */
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        <button
                            type="button"
                            onClick={() => setActiveFolder('general')}
                            className="group flex flex-col items-start gap-3 rounded-xl border bg-card p-5 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                        >
                            <Folder className="h-10 w-10 text-amber-500 transition-transform group-hover:scale-110" />
                            <div>
                                <p className="font-semibold">Umum</p>
                                <p className="text-xs text-muted-foreground">{folderCounts['general'] || 0} file</p>
                            </div>
                        </button>
                        {clients.map((client) => (
                            <button
                                key={client.id}
                                type="button"
                                onClick={() => setActiveFolder(client.id)}
                                className="group flex flex-col items-start gap-3 rounded-xl border bg-card p-5 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                            >
                                <FolderOpen className="h-10 w-10 text-blue-500 transition-transform group-hover:scale-110" />
                                <div>
                                    <p className="font-semibold line-clamp-1" title={client.name}>{client.name}</p>
                                    <p className="text-xs text-muted-foreground">{folderCounts[String(client.id)] || 0} file</p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    /* ===== Isi folder ===== */
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {visibleFiles.map((file) => (
                            <Card key={file.id} className="group relative overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-primary/50">
                                <CardHeader className="p-4 pb-2 border-b bg-muted/20 flex flex-row items-start justify-between space-y-0">
                                    <a href={`/files/${file.id}/preview`} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full h-24 bg-card rounded-md border border-dashed hover:bg-muted transition-colors cursor-pointer">
                                        {getFileIcon(file.extension)}
                                    </a>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background rounded-md shadow-sm border">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <a href={`/files/${file.id}/preview`} target="_blank" rel="noreferrer" className="cursor-pointer">
                                                        <FileText className="mr-2 h-4 w-4" /> Preview
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <a href={`/files/${file.id}/download`} className="cursor-pointer">
                                                        <Download className="mr-2 h-4 w-4" /> Download
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openDeleteModal(file)} className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-medium text-sm line-clamp-2 mb-1" title={file.name}>
                                            {file.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground uppercase">
                                            {file.extension} • {formatBytes(file.size)}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                                        <div className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted border">
                                            {file.creator?.name.charAt(0)}
                                        </div>
                                        <span className="truncate">{file.creator?.name}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {visibleFiles.length === 0 && (
                            <div className="col-span-full py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                                <Folder className="mx-auto h-12 w-12 opacity-20 mb-3" />
                                <h3 className="font-semibold text-lg mb-1">Folder masih kosong</h3>
                                <p className="mb-4 text-sm">Upload file pertama untuk folder {activeFolderName}.</p>
                                <Button onClick={openUploadModal} variant="outline">
                                    <Plus className="mr-2 h-4 w-4" /> Upload File
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Upload File</DialogTitle>
                        <DialogDescription>
                            Bisa pilih atau drop banyak file sekaligus. File tersimpan privat dan hanya bisa diakses setelah login.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitUpload} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Folder / Client</Label>
                            <Select value={data.client_id || 'general'} onValueChange={v => setData('client_id', v === 'general' ? '' : v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih folder" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">Umum (tanpa client)</SelectItem>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={String(client.id)}>{client.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.client_id && <p className="text-sm text-destructive">{errors.client_id}</p>}
                        </div>

                        {/* Dropzone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                                isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
                            }`}
                        >
                            <UploadCloud className={`h-10 w-10 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                            <p className="text-sm font-medium">Drop file di sini atau klik untuk memilih</p>
                            <p className="text-xs text-muted-foreground">Bisa lebih dari satu file • Maks. 10MB per file</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
                            />
                        </div>
                        {errors.files && <p className="text-sm text-destructive">{errors.files}</p>}
                        {Object.entries(errors)
                            .filter(([key]) => key.startsWith('files.'))
                            .map(([key, message]) => (
                                <p key={key} className="text-sm text-destructive">{message as string}</p>
                            ))}

                        {/* Daftar file terpilih */}
                        {data.files.length > 0 && (
                            <div className="max-h-44 space-y-1.5 overflow-y-auto rounded-md border p-2">
                                {data.files.map((file, index) => (
                                    <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-2.5 py-1.5 text-sm">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            <span className="truncate" title={file.name}>{file.name}</span>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
                                            <button type="button" onClick={() => removeFile(index)} className="text-muted-foreground hover:text-destructive">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {progress && (
                            <div className="w-full bg-secondary rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${progress.percentage}%` }}></div>
                            </div>
                        )}

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing || data.files.length === 0}>
                                Upload {data.files.length > 0 ? `(${data.files.length} file)` : ''}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete File</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold break-all">{selectedFile?.name}</span>? This action cannot be undone.
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

FilesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Files',
            href: '/files',
        },
    ],
};
