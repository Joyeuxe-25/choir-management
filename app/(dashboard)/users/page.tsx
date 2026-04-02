'use client';
import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/SearchBar';
import FilterBar from '@/components/shared/FilterBar';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import UserList from '@/components/users/UserList';
import UserFormModal from '@/components/users/UserFormModal';
import UserDetailModal from '@/components/users/UserDetailModal';
import { usersApi } from '@/lib/api';
import { User } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [voiceFilter, setVoiceFilter] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [viewingUser, setViewingUser] = useState<User | undefined>(undefined);

  // Load users from backend
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const params: Record<string, string> = {};
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;
      if (voiceFilter) params.voice = voiceFilter;
      if (searchQuery) params.search = searchQuery;
      const res = await usersApi.getAll(params);
      setUsers(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, statusFilter, voiceFilter]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const roleOptions = [
    { value: '', label: 'All roles' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Secretary', label: 'Secretary' },
    { value: 'VoiceLeader', label: 'Voice Leader' },
  ];

  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  const voiceOptions = [
    { value: '', label: 'All voices' },
    { value: 'Soprano', label: 'Soprano' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Tenor', label: 'Tenor' },
    { value: 'Bass', label: 'Bass' },
  ];

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

  const handleSaveUser = async (userData: any) => {
    try {
      if (editingUser) {
        await usersApi.update(String(editingUser.id), userData);
      } else {
        await usersApi.create(userData);
      }
      setIsFormModalOpen(false);
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`Delete user "${user.name}"?`)) {
      try {
        await usersApi.delete(String(user.id));
        loadUsers();
      } catch (err: any) {
        alert(err.message || 'Failed to delete user');
      }
    }
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
      {isLoading && <p style={{ padding: '1rem' }}>Loading users...</p>}
      {error && <p style={{ padding: '1rem', color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <UserList
          users={filteredUsers}
          onEdit={handleEditUser}
          onView={handleViewUser}
          onDelete={handleDeleteUser}
        />
      )}
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