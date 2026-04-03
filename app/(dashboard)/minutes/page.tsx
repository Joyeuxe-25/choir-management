'use client';
import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/SearchBar';
import FilterBar from '@/components/shared/FilterBar';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import MinutesList from '@/components/minutes/MinutesList';
import MinuteFormModal from '@/components/minutes/MinuteFormModal';
import MinuteDetailModal from '@/components/minutes/MinuteDetailModal';
import { minutesApi } from '@/lib/api';
import { Minute } from '@/types';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function MinutesPage() {
  const [minutes, setMinutes] = useState<Minute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMinute, setEditingMinute] = useState<Minute | undefined>(undefined);
  const [viewingMinute, setViewingMinute] = useState<Minute | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const loadMinutes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const params: Record<string, string> = {};
      if (dateFilter) params.meeting_date = dateFilter;
      if (searchQuery) params.title = searchQuery;
      const res = await minutesApi.getAll(params);
      setMinutes(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load minutes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadMinutes(); }, [dateFilter]);

  const filteredMinutes = useMemo(() => {
    if (!searchQuery) return minutes;
    return minutes.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [minutes, searchQuery]);

  const handleAddMinute = () => { setEditingMinute(undefined); setIsFormModalOpen(true); };
  const handleEditMinute = (minute: Minute) => { setEditingMinute(minute); setIsFormModalOpen(true); };
  const handleViewMinute = (minute: Minute) => { setViewingMinute(minute); };

  const handleSaveMinute = async (minuteData: any) => {
    try {
      setIsSaving(true);
      const { file, ...rest } = minuteData;

      let payload: any = { ...rest };

      if (file instanceof File) {
        if (file.size > 800 * 1024) {
          alert('File is too large. Please use a file under 800KB.');
          return;
        }
        const base64 = await fileToBase64(file);
        payload.attachment_url = base64;
        payload.attachment_name = file.name;
        payload.attachment_type = file.type;
        payload.attachment_size = file.size;
        payload.attachment_uploaded_at = new Date().toISOString().split('T')[0];
      }

      if (editingMinute) {
        await minutesApi.update(String(editingMinute.id), payload);
      } else {
        await minutesApi.create(payload);
      }
      setIsFormModalOpen(false);
      loadMinutes();
    } catch (err: any) {
      alert(err.message || 'Failed to save minutes');
    } finally {
      setIsSaving(false);
    }
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
        <Input label="Meeting Date" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
      </FilterBar>
      {isLoading && <p style={{ padding: '1rem' }}>Loading minutes...</p>}
      {error && <p style={{ padding: '1rem', color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <MinutesList
          minutes={filteredMinutes}
          onEdit={handleEditMinute}
          onView={handleViewMinute}
        />
      )}
      <MinuteFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveMinute}
        initialData={editingMinute}
        isSaving={isSaving}
      />
      <MinuteDetailModal
        isOpen={!!viewingMinute}
        onClose={() => setViewingMinute(undefined)}
        minute={viewingMinute}
      />
    </>
  );
}