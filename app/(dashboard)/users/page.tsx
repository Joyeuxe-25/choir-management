'use client';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/SearchBar';
import FilterBar from '@/components/shared/FilterBar';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import UserList from '@/components/users/UserList';
import UserFormModal from '@/components/users/UserFormModal';
import UserDetailModal from '@/components/users/UserDetailModal';
import { users as initialUsers } from '@/data/users';
import { User } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [voiceFilter, setVoiceFilter] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [viewingUser, setViewingUser] = useState<User | undefined>(undefined);

  const roleOptions = [
    { value: '', label: 'All roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'secretary', label: 'Secretary' },
    { value: 'voiceLeader', label: 'Voice Leader' },
  ];

  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const voiceOptions = [
    { value: '', label: 'All voices' },
    { value: 'Soprano', label: 'Soprano' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Tenor', label: 'Tenor' },
    { value: 'Bass', label: 'Bass' },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter ? user.role === roleFilter : true;
      const matchesStatus = statusFilter ? user.status === statusFilter : true;
      const matchesVoice = voiceFilter ? user.voice === voiceFilter : true;
      return matchesSearch && matchesRole && matchesStatus && matchesVoice;
    });
  }, [users, searchQuery, roleFilter, statusFilter, voiceFilter]);

  const handleAddUser = () => {
    setEditingUser(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  };

  const handleViewUser = (user: User) => {
    setViewingUser(user);
  };

  const handleSaveUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (editingUser) {
      // Edit existing
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...userData } : u));
    } else {
      // Add new
      const newId = String(Math.max(...users.map(u => parseInt(u.id)), 0) + 1);
      const newUser: User = {
        id: newId,
        ...userData,
        createdAt: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
    }
    setIsFormModalOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage system users and their roles."
        actions={<Button variant="primary" onClick={handleAddUser}>+ Add User</Button>}
      />
      <FilterBar title="Filters">
        <SearchBar placeholder="Search by name or email..." onSearch={setSearchQuery} />
        <Select label="Role" options={roleOptions} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} />
        <Select label="Status" options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
        <Select label="Voice" options={voiceOptions} value={voiceFilter} onChange={(e) => setVoiceFilter(e.target.value)} />
      </FilterBar>
      <UserList
        users={filteredUsers}
        onEdit={handleEditUser}
        onView={handleViewUser}
      />
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveUser}
        initialData={editingUser}
      />
      <UserDetailModal
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(undefined)}
        user={viewingUser}
      />
    </>
  );
}