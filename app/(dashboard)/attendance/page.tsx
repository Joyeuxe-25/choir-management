'use client';
import { useState, useEffect, useMemo } from 'react';
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
import { attendanceApi } from '@/lib/api';
import { eventTypes } from '@/data/eventTypes';
import { AttendanceRecord } from '@/types';

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceFilter, setVoiceFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | undefined>(undefined);
  const [viewingRecord, setViewingRecord] = useState<AttendanceRecord | undefined>(undefined);

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      setError('');
      const params: Record<string, string> = {};
      if (voiceFilter) params.voice = voiceFilter;
      if (eventFilter) params.event_type = eventFilter;
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;
      if (searchQuery) params.member = searchQuery;
      const res = await attendanceApi.getAll(params);
      setRecords(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadRecords(); }, [voiceFilter, eventFilter, statusFilter, dateFilter]);

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return records;
    return records.filter(r =>
      r.member_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [records, searchQuery]);

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
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' },
    { value: 'Excused', label: 'Excused' },
    { value: 'Late', label: 'Late' },
  ];

  const capitalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const handleMarkAttendance = async (newRecords: any[]) => {
    try {
      for (const record of newRecords) {
        await attendanceApi.create({
          ...record,
          status: capitalize(record.status),
        });
      }
      setIsMarkModalOpen(false);
      loadRecords();
    } catch (err: any) {
      alert(err.message || 'Failed to save attendance');
    }
  };

  const handleEditRecord = async (updatedRecord: AttendanceRecord) => {
    try {
      await attendanceApi.update(String(updatedRecord.id), {
        status: capitalize(updatedRecord.status),
      });
      setEditingRecord(undefined);
      loadRecords();
    } catch (err: any) {
      alert(err.message || 'Failed to update attendance');
    }
  };

  const handleDeleteRecord = async (record: AttendanceRecord) => {
    if (!confirm(`Delete attendance record for "${record.member_name}" on ${record.date}?`)) return;
    try {
      await attendanceApi.delete(String(record.id));
      loadRecords();
    } catch (err: any) {
      alert(err.message || 'Failed to delete attendance record');
    }
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
      {isLoading && <p style={{ padding: '1rem' }}>Loading attendance records...</p>}
      {error && <p style={{ padding: '1rem', color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <AttendanceList
          records={filteredRecords}
          onEdit={setEditingRecord}
          onView={(record) => setViewingRecord(record)}
          onDelete={handleDeleteRecord}
        />
      )}
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