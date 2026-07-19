import { apiFetch } from '@/lib/fetch';
import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderPlus, Upload, FileText, Folder, Download, Trash, ShieldAlert, FileImage, FileArchive } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function ProjectDocuments({ project }: { project: any }) {
    const { auth } = usePage().props as any;
    const [currentFolder, setCurrentFolder] = useState<number | null>(null);
    const [folders, setFolders] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    
    // Forms
    const [folderName, setFolderName] = useState('');
    const [fileData, setFileData] = useState({ file: null as File | null, is_confidential: false });

    const fetchDocuments = async () => {
        try {
            const res = await apiFetch(`/api/v1/projects/${project.id}/documents${currentFolder ? `?folder_id=${currentFolder}` : ''}`, {
                headers: {
                    'Accept': 'application/json',
                    // Assuming sanctum cookie based auth
                }
            });
            const data = await res.json();
            if(data.folders) {
                setFolders(data.folders);
                setDocuments(data.documents);
            }
        } catch (e) {
            console.error('Failed to fetch documents');
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [currentFolder]);

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await apiFetch(`/api/v1/projects/${project.id}/document-folders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name: folderName, parent_id: currentFolder })
            });
            if (res.ok) {
                toast.success('Folder created');
                setFolderName('');
                setIsCreateFolderOpen(false);
                fetchDocuments();
            } else {
                toast.error('Failed to create folder');
            }
        } catch (e) {
            toast.error('Error creating folder');
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileData.file) return;

        const formData = new FormData();
        formData.append('file', fileData.file);
        if (currentFolder) formData.append('folder_id', currentFolder.toString());
        formData.append('is_confidential', fileData.is_confidential ? '1' : '0');

        try {
            const res = await apiFetch(`/api/v1/projects/${project.id}/documents`, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            });
            if (res.ok) {
                toast.success('Document uploaded');
                setIsUploadOpen(false);
                setFileData({ file: null, is_confidential: false });
                fetchDocuments();
            } else {
                toast.error('Failed to upload document');
            }
        } catch (e) {
            toast.error('Error uploading document');
        }
    };

    const deleteDocument = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await apiFetch(`/api/v1/documents/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
            if (res.ok) {
                toast.success('Deleted successfully');
                fetchDocuments();
            }
        } catch (e) {
            toast.error('Error deleting document');
        }
    };

    const getFileIcon = (type: string) => {
        if (['pdf'].includes(type.toLowerCase())) return <FileText className="h-8 w-8 text-red-500" />;
        if (['jpg', 'jpeg', 'png', 'gif'].includes(type.toLowerCase())) return <FileImage className="h-8 w-8 text-blue-500" />;
        if (['zip', 'rar'].includes(type.toLowerCase())) return <FileArchive className="h-8 w-8 text-yellow-600" />;
        return <FileText className="h-8 w-8 text-gray-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {currentFolder && (
                        <Button variant="outline" size="sm" onClick={() => setCurrentFolder(null)}>
                            &larr; Back to root
                        </Button>
                    )}
                    <h3 className="text-lg font-medium">Document Center</h3>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline"><FolderPlus className="h-4 w-4 mr-2" /> New Folder</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>New Folder</DialogTitle></DialogHeader>
                            <form onSubmit={handleCreateFolder} className="space-y-4">
                                <div>
                                    <Label>Folder Name</Label>
                                    <Input required value={folderName} onChange={(e) => setFolderName(e.target.value)} />
                                </div>
                                <Button type="submit">Create</Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                        <DialogTrigger asChild>
                            <Button><Upload className="h-4 w-4 mr-2" /> Upload File</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <Label>Select File</Label>
                                    <Input required type="file" onChange={(e) => setFileData({...fileData, file: e.target.files?.[0] || null})} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch checked={fileData.is_confidential} onCheckedChange={(c) => setFileData({...fileData, is_confidential: c})} />
                                    <Label>Mark as Confidential</Label>
                                </div>
                                <p className="text-xs text-muted-foreground">Confidential documents are only visible to executives and explicitly permitted users.</p>
                                <Button type="submit">Upload</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="min-h-[400px]">
                <CardContent className="p-6">
                    {folders.length === 0 && documents.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Folder className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p>This folder is empty.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {folders.map(folder => (
                                <div key={folder.id} onClick={() => setCurrentFolder(folder.id)} className="group cursor-pointer p-4 rounded-lg border hover:border-primary hover:bg-muted/50 transition-colors flex flex-col items-center text-center">
                                    <Folder className="h-10 w-10 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" fill="currentColor" />
                                    <span className="text-sm font-medium truncate w-full">{folder.name}</span>
                                </div>
                            ))}

                            {documents.map(doc => (
                                <div key={doc.id} className="relative group p-4 rounded-lg border hover:border-primary hover:bg-muted/50 transition-colors flex flex-col items-center text-center">
                                    {doc.is_confidential && (
                                        <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1" title="Confidential">
                                            <ShieldAlert className="h-3 w-3" />
                                        </div>
                                    )}
                                    {getFileIcon(doc.file_type)}
                                    <span className="text-sm font-medium truncate w-full mt-2" title={doc.name}>{doc.name}</span>
                                    <span className="text-xs text-muted-foreground">{(doc.file_size / 1024).toFixed(1)} KB</span>
                                    
                                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                                        <Button size="icon" variant="secondary" onClick={() => window.open(`/api/v1/documents/${doc.id}/download`, '_blank')}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="destructive" onClick={() => deleteDocument(doc.id)}>
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
