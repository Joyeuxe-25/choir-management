'use client';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/SearchBar';
import FilterBar from '@/components/shared/FilterBar';
import Select from '@/components/shared/Select';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import AttendanceList from '@/components/attendance/AttendanceList';
import MarkAttendanceModal from '@/components/attendance/MarkAttendanceModal';
import EditAttendanceModal from '@/components/attendance/EditAttendanceModal';
import AttendanceDetailModal from '@/components/attendance/AttendanceDetailModal';
import { attendanceRecords as initialRecords } from '@/data/attendance';
import { eventTypes } from '@/data/eventTypes';
import { AttendanceRecord } from '@/types';

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceFilter, setVoiceFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | undefined>(undefined);
  const [viewingRecord, setViewingRecord] = useState<AttendanceRecord | undefined>(undefined);

  const voiceOptions = [
    { value: '', label: 'All voices' },
    { value: 'Soprano', label: 'Soprano' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Tenor', label: 'Tenor' },
    { value: 'Bass', label: 'Bass' },
  ];

  const eventOptions = [
    { value: '', label: 'All events' },
    ...eventTypes.map(et => ({ value: et, label: et })),
  ];

  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'excused', label: 'Excused' },
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = record.memberName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVoice = voiceFilter ? record.voice === voiceFilter : true;
      const matchesEvent = eventFilter ? record.eventType === eventFilter : true;
      const matchesStatus = statusFilter ? record.status === statusFilter : true;
      const matchesDate = dateFilter ? record.date === dateFilter : true;
      return matchesSearch && matchesVoice && matchesEvent && matchesStatus && matchesDate;
    });
  }, [records, searchQuery, voiceFilter, eventFilter, statusFilter, dateFilter]);

  const handleMarkAttendance = (newRecords: Omit<AttendanceRecord, 'id'>[]) => {
    const newIds = records.length + 1;
    const recordsWithIds = newRecords.map((r, idx) => ({ ...r, id: String(newIds + idx) }));
    setRecords([...records, ...recordsWithIds]);
    setIsMarkModalOpen(false);
  };

  const handleEditRecord = (updatedRecord: AttendanceRecord) => {
    setRecords(records.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    setEditingRecord(undefined);
  };

  const handleViewRecord = (record: AttendanceRecord) => {
    setViewingRecord(record);
  };

  return (
    <>
      <PageHeader
        title="Attendance"
        description="Manage choir attendance records."
        actions={<Button variant="primary" onClick={() => setIsMarkModalOpen(true)}>+ Mark Attendance</Button>}
      />
      <FilterBar title="Filters">
        <SearchBar placeholder="Search by member name..." onSearch={setSearchQuery} />
        <Select label="Voice" options={voiceOptions} value={voiceFilter} onChange={(e) => setVoiceFilter(e.target.value)} />
        <Select label="Event Type" options={eventOptions} value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} />
        <Select label="Status" options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
        <Input label="Date" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
      </FilterBar>
      <AttendanceList
        records={filteredRecords}
        onEdit={setEditingRecord}
        onView={handleViewRecord}
      />
      <MarkAttendanceModal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        onSave={handleMarkAttendance}
      />
      <EditAttendanceModal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(undefined)}
        onSave={handleEditRecord}
        initialData={editingRecord}
      />
      <AttendanceDetailModal
        isOpen={!!viewingRecord}
        onClose={() => setViewingRecord(undefined)}
        record={viewingRecord}
      />
    </>
  );
}