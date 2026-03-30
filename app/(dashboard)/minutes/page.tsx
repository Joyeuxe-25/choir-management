'use client';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/SearchBar';
import FilterBar from '@/components/shared/FilterBar';
import Select from '@/components/shared/Select';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import MinutesList from '@/components/minutes/MinutesList';
import MinuteFormModal from '@/components/minutes/MinuteFormModal';
import MinuteDetailModal from '@/components/minutes/MinuteDetailModal';
import { minutes as initialMinutes } from '@/data/minutes';
import { Minute } from '@/types';

export default function MinutesPage() {
  const [minutes, setMinutes] = useState<Minute[]>(initialMinutes);
  const [searchQuery, setSearchQuery] = useState('');
  const [recordedByFilter, setRecordedByFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMinute, setEditingMinute] = useState<Minute | undefined>(undefined);
  const [viewingMinute, setViewingMinute] = useState<Minute | undefined>(undefined);

  // Unique recordedBy options from dummy data
  const recordedByOptions = [
    { value: '', label: 'All recorders' },
    ...Array.from(new Set(minutes.map(m => m.recordedBy))).map(name => ({ value: name, label: name })),
  ];

  const filteredMinutes = useMemo(() => {
    return minutes.filter(minute => {
      const matchesSearch = minute.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRecordedBy = recordedByFilter ? minute.recordedBy === recordedByFilter : true;
      const matchesDate = dateFilter ? minute.meetingDate === dateFilter : true;
      return matchesSearch && matchesRecordedBy && matchesDate;
    });
  }, [minutes, searchQuery, recordedByFilter, dateFilter]);

  const handleAddMinute = () => {
    setEditingMinute(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditMinute = (minute: Minute) => {
    setEditingMinute(minute);
    setIsFormModalOpen(true);
  };

  const handleViewMinute = (minute: Minute) => {
    setViewingMinute(minute);
  };

  const handleSaveMinute = (minuteData: Omit<Minute, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMinute) {
      // Edit existing
      setMinutes(minutes.map(m => m.id === editingMinute.id ? { ...editingMinute, ...minuteData, updatedAt: new Date().toISOString() } : m));
    } else {
      // Add new
      const newId = String(Math.max(...minutes.map(m => parseInt(m.id)), 0) + 1);
      const now = new Date().toISOString();
      const newMinute: Minute = {
        id: newId,
        ...minuteData,
        createdAt: now,
        updatedAt: now,
      };
      setMinutes([...minutes, newMinute]);
    }
    setIsFormModalOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Minutes"
        description="Manage choir meeting minutes."
        actions={<Button variant="primary" onClick={handleAddMinute}>+ Add Minutes</Button>}
      />
      <FilterBar title="Filters">
        <SearchBar placeholder="Search by meeting title..." onSearch={setSearchQuery} />
        <Select label="Recorded By" options={recordedByOptions} value={recordedByFilter} onChange={(e) => setRecordedByFilter(e.target.value)} />
        <Input label="Meeting Date" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
      </FilterBar>
      <MinutesList
        minutes={filteredMinutes}
        onEdit={handleEditMinute}
        onView={handleViewMinute}
      />
      <MinuteFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveMinute}
        initialData={editingMinute}
      />
      <MinuteDetailModal
        isOpen={!!viewingMinute}
        onClose={() => setViewingMinute(undefined)}
        minute={viewingMinute}
      />
    </>
  );
}