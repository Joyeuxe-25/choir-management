'use client';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/SearchBar';
import FilterBar from '@/components/shared/FilterBar';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import MemberList from '@/components/members/MemberList';
import MemberFormModal from '@/components/members/MemberFormModal';
import MemberDetailModal from '@/components/members/MemberDetailModal';
import { members as initialMembers } from '@/data/members';
import { Member } from '@/types';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceFilter, setVoiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | undefined>(undefined);
  const [viewingMember, setViewingMember] = useState<Member | undefined>(undefined);

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVoice = voiceFilter ? member.voice === voiceFilter : true;
      const matchesStatus = statusFilter ? member.status === statusFilter : true;
      return matchesSearch && matchesVoice && matchesStatus;
    });
  }, [members, searchQuery, voiceFilter, statusFilter]);

  const handleAddMember = () => {
    setEditingMember(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setIsFormModalOpen(true);
  };

  const handleViewMember = (member: Member) => {
    setViewingMember(member);
  };

  const handleSaveMember = (memberData: Omit<Member, 'id'>) => {
    if (editingMember) {
      // Edit existing
      setMembers(members.map(m => m.id === editingMember.id ? { ...memberData, id: editingMember.id } : m));
    } else {
      // Add new
      const newId = String(Math.max(...members.map(m => parseInt(m.id)), 0) + 1);
      setMembers([...members, { ...memberData, id: newId }]);
    }
    setIsFormModalOpen(false);
  };

  const voiceOptions = [
    { value: '', label: 'All voices' },
    { value: 'Soprano', label: 'Soprano' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Tenor', label: 'Tenor' },
    { value: 'Bass', label: 'Bass' },
  ];

  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <>
      <PageHeader
        title="Members"
        description="Manage choir members: add, edit, view profiles."
        actions={<Button variant="primary" onClick={handleAddMember}>+ Add Member</Button>}
      />
      <FilterBar title="Filters">
        <SearchBar
          placeholder="Search by name..."
          onSearch={(query) => setSearchQuery(query)}
        />
        <Select
          label="Voice"
          options={voiceOptions}
          value={voiceFilter}
          onChange={(e) => setVoiceFilter(e.target.value)}
        />
        <Select
          label="Status"
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </FilterBar>
      <MemberList
        members={filteredMembers}
        onEdit={handleEditMember}
        onView={handleViewMember}
      />
      <MemberFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveMember}
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