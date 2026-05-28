import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreVertical, File, FileText, Image as ImageIcon, FileArchive, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FilesIndex({ files }: { files: any[] }) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any>(null);

    const { data, setData, post, delete: destroy, processing, errors, reset, progress } = useForm({
        file: null as File | null,
    });

    const openUploadModal = () => {
        reset();
        setIsUploadModalOpen(true);
    };

    const openDeleteModal = (file: any) => {
        setSelectedFile(file);
        setIsDeleteModalOpen(true);
    };

    const submitUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post('/files', {
            preserveScroll: true,
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
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const getFileIcon = (extension: string) => {
        const ext = extension.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) {
            return <ImageIcon className="h-10 w-10 text-blue-500" />;
        }
        if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) {
            return <FileText className="h-10 w-10 text-orange-500" />;
        }
        if (['zip', 'rar', 'tar', 'gz'].includes(ext)) {
            return <FileArchive className="h-10 w-10 text-red-500" />;
        }
        return <File className="h-10 w-10 text-gray-500" />;
    };

    return (
        <>
            <Head title="Files & Assets" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Files & Assets</h2>
                        <p className="text-muted-foreground">Manage and share company assets securely.</p>
                    </div>
                    <Button onClick={openUploadModal}>
                        <Plus className="mr-2 h-4 w-4" /> Upload File
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {files.map((file) => (
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
                    
                    {files.length === 0 && (
                        <div className="col-span-full py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                            <File className="mx-auto h-12 w-12 opacity-20 mb-3" />
                            <h3 className="font-semibold text-lg mb-1">No files uploaded</h3>
                            <p className="mb-4 text-sm">Upload your first company asset or document.</p>
                            <Button onClick={openUploadModal} variant="outline">
                                <Plus className="mr-2 h-4 w-4" /> Upload File
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload File</DialogTitle>
                        <DialogDescription>Select a file to upload to the company storage.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitUpload} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="file">Select File</Label>
                            <Input 
                                id="file" 
                                type="file" 
                                onChange={e => setData('file', e.target.files ? e.target.files[0] : null)} 
                                required 
                            />
                            {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                            <p className="text-xs text-muted-foreground">Maximum file size: 10MB</p>
                        </div>

                        {progress && (
                            <div className="w-full bg-secondary rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${progress.percentage}%` }}></div>
                            </div>
                        )}
                        
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing || !data.file}>Upload</Button>
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
