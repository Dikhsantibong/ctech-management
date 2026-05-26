import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function UsersIndex({ users }: { users: any[] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'staff',
        password: '',
    });

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (user: any) => {
        setSelectedUser(user);
        setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (user: any) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${selectedUser?.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/users/${selectedUser?.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    const roleBadgeColor = (role: string) => {
        switch (role) {
            case 'super_admin': return 'destructive';
            case 'admin_operasional': return 'default';
            default: return 'secondary';
        }
    };

    const formatRole = (role: string) => {
        return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <>
            <Head title="Team Members" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
                        <p className="text-muted-foreground">Manage your startup team and their roles.</p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" /> Add Member
                    </Button>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">{user.email}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={roleBadgeColor(user.role)}>
                                                    {formatRole(user.role)}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString()}
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
                                                        <DropdownMenuItem onClick={() => openEditModal(user)}>
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openDeleteModal(user)} className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                No team members found.
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Team Member</DialogTitle>
                        <DialogDescription>Add a new user to your startup's management system.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={data.role} onValueChange={value => setData('role', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="super_admin">Super Admin</SelectItem>
                                    <SelectItem value="admin_operasional">Admin Operasional</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} required />
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Team Member</DialogTitle>
                        <DialogDescription>Update the details and role for {selectedUser?.name}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input id="edit-name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input id="edit-email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select value={data.role} onValueChange={value => setData('role', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="super_admin">Super Admin</SelectItem>
                                    <SelectItem value="admin_operasional">Admin Operasional</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-password">Password (Leave blank to keep current)</Label>
                            <Input id="edit-password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>Update</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Team Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove <span className="font-semibold">{selectedUser?.name}</span>? This action cannot be undone.
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

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Team Members',
            href: '/users',
        },
    ],
};
