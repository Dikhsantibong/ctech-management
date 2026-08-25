import { apiFetch } from '@/lib/fetch';
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FolderPlus, Upload, FileText, Folder, Download, Trash, ShieldAlert, FileImage, FileArchive,
    ArrowLeft, UploadCloud, X, Loader2, File as FileIcon,
} from 'lucide-react';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const formatBytes = (bytes: number) => {
    if (!+bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export default function ProjectDocuments({ project }: { project: any }) {
    const [currentFolder, setCurrentFolder] = useState<number | null>(null);
    const [folderTrail, setFolderTrail] = useState<{ id: number; name: string }[]>([]);
    const [folders, setFolders] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [folderName, setFolderName] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isConfidential, setIsConfidential] = useState(false);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(
                `/api/v1/projects/${project.id}/documents${currentFolder ? `?folder_id=${currentFolder}` : ''}`,
            );
            if (!res.ok) throw new Error('request failed');
            const data = await res.json();
            setFolders(data.folders ?? []);
            setDocuments(data.documents ?? []);
        } catch {
            toast.error('Gagal memuat dokumen');
            setFolders([]);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFolder]);

    const openFolder = (folder: any) => {
        setFolderTrail((trail) => [...trail, { id: folder.id, name: folder.name }]);
        setCurrentFolder(folder.id);
    };

    const goToRoot = () => {
        setFolderTrail([]);
        setCurrentFolder(null);
    };

    const goToTrailIndex = (index: number) => {
        const target = folderTrail[index];
        setFolderTrail(folderTrail.slice(0, index + 1));
        setCurrentFolder(target.id);
    };

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await apiFetch(`/api/v1/projects/${project.id}/document-folders`, {
                method: 'POST',
                body: JSON.stringify({ name: folderName, parent_id: currentFolder }),
            });
            if (res.ok) {
                toast.success('Folder dibuat');
                setFolderName('');
                setIsCreateFolderOpen(false);
                fetchDocuments();
            } else {
                toast.error('Gagal membuat folder');
            }
        } catch {
            toast.error('Gagal terhubung ke server');
        }
    };

    const addFiles = (incoming: FileList | null) => {
        if (!incoming || incoming.length === 0) return;
        setSelectedFiles((prev) => [...prev, ...Array.from(incoming)]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFiles.length === 0) return;

        setUploading(true);
        let success = 0;
        const failed: string[] = [];

        // Endpoint menerima satu file per request; kirim berurutan lalu laporkan ringkasannya
        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append('file', file);
            if (currentFolder) formData.append('folder_id', String(currentFolder));
            formData.append('is_confidential', isConfidential ? '1' : '0');

            try {
                const res = await apiFetch(`/api/v1/projects/${project.id}/documents`, {
                    method: 'POST',
                    body: formData,
                });
                if (res.ok) success++;
                else failed.push(file.name);
            } catch {
                failed.push(file.name);
            }
        }

        setUploading(false);

        if (success > 0) toast.success(`${success} dokumen berhasil diupload`);
        if (failed.length > 0) toast.error(`Gagal upload: ${failed.join(', ')}`);

        if (success > 0) {
            setIsUploadOpen(false);
            setSelectedFiles([]);
            setIsConfidential(false);
            fetchDocuments();
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            const res = await apiFetch(`/api/v1/documents/${deleteTarget.id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Dokumen dihapus');
                setDeleteTarget(null);
                fetchDocuments();
            } else {
                toast.error('Gagal menghapus dokumen');
            }
        } catch {
            toast.error('Gagal terhubung ke server');
        }
    };

    const getFileIcon = (type: string) => {
        const t = (type || '').toLowerCase();
        if (t === 'pdf') return <FileText className="h-8 w-8 text-rose-500" />;
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(t)) return <FileImage className="h-8 w-8 text-blue-500" />;
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(t)) return <FileArchive className="h-8 w-8 text-amber-500" />;
        if (['doc', 'docx'].includes(t)) return <FileText className="h-8 w-8 text-sky-600" />;
        if (['xls', 'xlsx', 'csv'].includes(t)) return <FileText className="h-8 w-8 text-emerald-600" />;
        return <FileText className="h-8 w-8 text-slate-400" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <Folder className="h-5 w-5 text-muted-foreground" /> Pusat Dokumen
                    </h3>
                    {/* Breadcrumb folder */}
                    <div className="mt-0.5 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                        <button type="button" onClick={goToRoot} className="hover:text-foreground hover:underline">
                            Root
                        </button>
                        {folderTrail.map((folder, index) => (
                            <span key={folder.id} className="flex items-center gap-1">
                                <span>/</span>
                                <button
                                    type="button"
                                    onClick={() => goToTrailIndex(index)}
                                    className="max-w-[160px] truncate hover:text-foreground hover:underline"
                                >
                                    {folder.name}
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex shrink-0 gap-2">
                    {currentFolder && (
                        <Button variant="outline" size="icon" onClick={goToRoot} title="Kembali ke root">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}

                    <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <FolderPlus className="mr-2 h-4 w-4" /> Folder Baru
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Folder Baru</DialogTitle>
                                <DialogDescription>
                                    Folder dibuat di dalam {folderTrail.length > 0 ? `"${folderTrail[folderTrail.length - 1].name}"` : 'root'}.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateFolder} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label>Nama Folder</Label>
                                    <Input
                                        required
                                        placeholder="Contoh: Kontrak, Aset Desain, Laporan"
                                        value={folderName}
                                        onChange={(e) => setFolderName(e.target.value)}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button type="submit">Buat Folder</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Upload className="mr-2 h-4 w-4" /> Upload Dokumen
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Upload Dokumen</DialogTitle>
                                <DialogDescription>
                                    Bisa drop atau pilih beberapa file sekaligus. Semua file masuk ke folder yang sedang dibuka.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        addFiles(e.dataTransfer.files);
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                                        isDragging
                                            ? 'border-primary bg-primary/5'
                                            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
                                    }`}
                                >
                                    <UploadCloud className={`h-10 w-10 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <p className="text-sm font-medium">Drop file di sini atau klik untuk memilih</p>
                                    <p className="text-xs text-muted-foreground">Bisa lebih dari satu file</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            addFiles(e.target.files);
                                            e.target.value = '';
                                        }}
                                    />
                                </div>

                                {selectedFiles.length > 0 && (
                                    <div className="max-h-40 space-y-1.5 overflow-y-auto rounded-md border p-2">
                                        {selectedFiles.map((file, index) => (
                                            <div
                                                key={`${file.name}-${index}`}
                                                className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-2.5 py-1.5 text-sm"
                                            >
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                    <span className="truncate" title={file.name}>
                                                        {file.name}
                                                    </span>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="text-muted-foreground hover:text-destructive"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
                                    <Switch id="confidential" checked={isConfidential} onCheckedChange={setIsConfidential} />
                                    <div className="space-y-0.5">
                                        <Label htmlFor="confidential">Tandai sebagai Rahasia</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Dokumen rahasia hanya terlihat oleh direksi dan pengguna yang diberi izin khusus.
                                        </p>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={uploading || selectedFiles.length === 0}>
                                        {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="min-h-[400px]">
                <CardContent className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <Loader2 className="mb-2 h-8 w-8 animate-spin opacity-50" />
                            <p className="text-sm">Memuat dokumen…</p>
                        </div>
                    ) : folders.length === 0 && documents.length === 0 ? (
                        <div className="py-16 text-center">
                            <Folder className="mx-auto mb-3 h-12 w-12 text-muted-foreground/25" />
                            <h3 className="mb-1 font-semibold">Folder ini masih kosong</h3>
                            <p className="mb-4 text-sm text-muted-foreground">Upload dokumen atau buat subfolder untuk mulai merapikan berkas.</p>
                            <Button variant="outline" onClick={() => setIsUploadOpen(true)}>
                                <Upload className="mr-2 h-4 w-4" /> Upload Dokumen
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                            {folders.map((folder) => (
                                <button
                                    key={folder.id}
                                    type="button"
                                    onClick={() => openFolder(folder)}
                                    className="group flex flex-col items-center rounded-lg border p-4 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
                                >
                                    <Folder className="mb-2 h-10 w-10 text-amber-400 transition-transform group-hover:scale-110" fill="currentColor" />
                                    <span className="w-full truncate text-sm font-medium" title={folder.name}>
                                        {folder.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">Folder</span>
                                </button>
                            ))}

                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="group relative flex flex-col items-center rounded-lg border p-4 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
                                >
                                    {doc.is_confidential && (
                                        <div
                                            className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white"
                                            title="Dokumen rahasia"
                                        >
                                            <ShieldAlert className="h-3 w-3" />
                                        </div>
                                    )}
                                    {getFileIcon(doc.file_type)}
                                    <span className="mt-2 w-full truncate text-sm font-medium" title={doc.name}>
                                        {doc.name}
                                    </span>
                                    <span className="text-xs uppercase text-muted-foreground">
                                        {doc.file_type} • {formatBytes(doc.file_size)}
                                    </span>

                                    <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-background/85 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            title="Unduh"
                                            onClick={() => window.open(`/api/v1/documents/${doc.id}/download`, '_blank')}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="destructive" title="Hapus" onClick={() => setDeleteTarget(doc)}>
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Konfirmasi hapus */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Dokumen</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus <span className="font-semibold break-all">{deleteTarget?.name}</span>? Tindakan ini tidak bisa dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
                            Batal
                        </Button>
                        <Button type="button" variant="destructive" onClick={confirmDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
