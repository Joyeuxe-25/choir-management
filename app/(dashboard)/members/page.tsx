'use client';
import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/SearchBar';
import FilterBar from '@/components/shared/FilterBar';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import MemberList from '@/components/members/MemberList';
import MemberFormModal from '@/components/members/MemberFormModal';
import MemberDetailModal from '@/components/members/MemberDetailModal';
import { membersApi } from '@/lib/api';
import { useRole } from '@/context/RoleContext';
import { Member } from '@/types';

export default function MembersPage() {
  const { role, voiceSection } = useRole();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceFilter, setVoiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | undefined>(undefined);
  const [viewingMember, setViewingMember] = useState<Member | undefined>(undefined);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const params: Record<string, string> = {};
      if (role === 'voiceLeader' && voiceSection) {
        params.voice = voiceSection;
      } else if (voiceFilter) {
        params.voice = voiceFilter;
      }
      if (statusFilter) params.status = statusFilter;
      const res = await membersApi.getAll(params);
      setMembers(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [voiceFilter, statusFilter, role, voiceSection]);

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members;
    return members.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const voiceOptions = [
    { value: '', label: 'All voices' },
    { value: 'Soprano', label: 'Soprano' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Tenor', label: 'Tenor' },
    { value: 'Bass', label: 'Bass' },
  ];

  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  return (
    <>
      <PageHeader
        title="Members"
        description="Manage choir members: add, edit, view profiles."
        actions={
          <Button variant="primary" onClick={() => { setEditingMember(undefined); setIsFormModalOpen(true); }}>
            + Add Member
          </Button>
        }
      />
      <FilterBar title="Filters">
        <SearchBar placeholder="Search by name..." onSearch={setSearchQuery} />
        {role !== 'voiceLeader' && (
          <Select label="Voice" options={voiceOptions} value={voiceFilter} onChange={(e) => setVoiceFilter(e.target.value)} />
        )}
        <Select label="Status" options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
      </FilterBar>
      {isLoading && <p style={{ padding: '1rem' }}>Loading members...</p>}
      {error && <p style={{ padding: '1rem', color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <MemberList
          members={filteredMembers}
          onEdit={(m) => { setEditingMember(m); setIsFormModalOpen(true); }}
          onView={(m) => setViewingMember(m)}
          onDelete={async (member) => {
            if (confirm(`Delete ${member.name}?`)) {
              try {
                await membersApi.delete(String(member.id));
                loadMembers();
              } catch (err: any) {
                alert(err.message || 'Failed to delete member');
              }
            }
          }}
        />
      )}
      <MemberFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={async (memberData) => {
          try {
            if (editingMember) {
              await membersApi.update(String(editingMember.id), memberData);
            } else {
              await membersApi.create(memberData);
            }
            setIsFormModalOpen(false);
            loadMembers();
          } catch (err: any) {
            alert(err.message || 'Failed to save member');
          }
        }}
        initialData={editingMember}
      />
      <MemberDetailModal
        isOpen={!!viewingMember}
        onClose={() => setViewingMember(undefined)}
        member={viewingMember}
      />
    </>
  );
}