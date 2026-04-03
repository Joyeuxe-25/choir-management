'use client';
import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/SearchBar';
import FilterBar from '@/components/shared/FilterBar';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import SongList from '@/components/songs/SongList';
import SongFormModal from '@/components/songs/SongFormModal';
import SongDetailModal from '@/components/songs/SongDetailModal';
import { songsApi } from '@/lib/api';
import { useRole } from '@/context/RoleContext';
import { Song } from '@/types';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function SongsPage() {
  const { role, voiceSection } = useRole();
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [voiceFilter, setVoiceFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | undefined>(undefined);
  const [viewingSong, setViewingSong] = useState<Song | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const loadSongs = async () => {
    try {
      setIsLoading(true);
      setError('');
      const params: Record<string, string> = {};
      if (categoryFilter) params.category = categoryFilter;
      if (languageFilter) params.language = languageFilter;
      if (searchQuery) params.title = searchQuery;
      // Voice leaders see only their section + Full Choir
      // We load all and filter client-side since backend doesn't support OR filter
      if (role !== 'voiceLeader' && voiceFilter) {
        params.voice = voiceFilter;
      }
      const res = await songsApi.getAll(params);
      setSongs(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load songs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadSongs(); }, [categoryFilter, voiceFilter, languageFilter, role, voiceSection]);

  const filteredSongs = useMemo(() => {
    let list = songs;
    if (role === 'voiceLeader' && voiceSection) {
      list = list.filter(s => s.voice === voiceSection || s.voice === 'Full Choir');
    }
    if (searchQuery) {
      list = list.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [songs, searchQuery, role, voiceSection]);

  const canAdd = role === 'admin' || role === 'secretary' || role === 'voiceLeader';

  const handleSaveSong = async (songData: any) => {
    try {
      setIsSaving(true);
      const { file, ...rest } = songData;
      let payload: any = { ...rest };
      if (file instanceof File) {
        if (file.size > 800 * 1024) {
          alert('File is too large. Please use a file under 800KB.');
          return;
        }
        const base64 = await fileToBase64(file);
        payload.file_url = base64;
        payload.file_name = file.name;
        payload.file_type = file.type;
        payload.file_size = file.size;
        payload.file_uploaded_at = new Date().toISOString().split('T')[0];
      }
      if (editingSong) {
        await songsApi.update(String(editingSong.id), payload);
      } else {
        await songsApi.create(payload);
      }
      setIsFormModalOpen(false);
      loadSongs();
    } catch (err: any) {
      alert(err.message || 'Failed to save song');
    } finally {
      setIsSaving(false);
    }
  };

  const categoryOptions = [
    { value: '', label: 'All categories' },
    { value: 'Worship', label: 'Worship' },
    { value: 'Praise', label: 'Praise' },
    { value: 'Entrance', label: 'Entrance' },
    { value: 'Offertory', label: 'Offertory' },
    { value: 'Communion', label: 'Communion' },
    { value: 'Closing', label: 'Closing' },
    { value: 'Practice', label: 'Practice' },
    { value: 'Special Event', label: 'Special Event' },
    { value: 'Christmas', label: 'Christmas' },
    { value: 'Easter', label: 'Easter' },
    { value: 'Wedding', label: 'Wedding' },
    { value: 'Funeral', label: 'Funeral' },
  ];

  const voiceOptions = [
    { value: '', label: 'All voices' },
    { value: 'Full Choir', label: 'Full Choir' },
    { value: 'Soprano', label: 'Soprano' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Tenor', label: 'Tenor' },
    { value: 'Bass', label: 'Bass' },
  ];

  const languageOptions = [
    { value: '', label: 'All languages' },
    { value: 'Kinyarwanda', label: 'Kinyarwanda' },
    { value: 'English', label: 'English' },
    { value: 'French', label: 'French' },
    { value: 'Swahili', label: 'Swahili' },
    { value: 'Latin', label: 'Latin' },
  ];

  return (
    <>
      <PageHeader
        title="Songs"
        description="Manage choir song library."
        actions={
          canAdd
            ? <Button variant="primary" onClick={() => { setEditingSong(undefined); setIsFormModalOpen(true); }}>+ Add Song</Button>
            : undefined
        }
      />
      <FilterBar title="Filters">
        <SearchBar placeholder="Search by title..." onSearch={setSearchQuery} />
        <Select label="Category" options={categoryOptions} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
        {role !== 'voiceLeader' && (
          <Select label="Voice" options={voiceOptions} value={voiceFilter} onChange={(e) => setVoiceFilter(e.target.value)} />
        )}
        <Select label="Language" options={languageOptions} value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} />
      </FilterBar>
      {isLoading && <p style={{ padding: '1rem' }}>Loading songs...</p>}
      {error && <p style={{ padding: '1rem', color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <SongList
          songs={filteredSongs}
          onEdit={(s) => { setEditingSong(s); setIsFormModalOpen(true); }}
          onView={(s) => setViewingSong(s)}
          onDelete={async (song) => {
            if (confirm(`Delete "${song.title}"?`)) {
              try {
                await songsApi.delete(String(song.id));
                loadSongs();
              } catch (err: any) {
                alert(err.message || 'Failed to delete song');
              }
            }
          }}
        />
      )}
      <SongFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveSong}
        initialData={editingSong}
        isSaving={isSaving}
      />
      <SongDetailModal
        isOpen={!!viewingSong}
        onClose={() => setViewingSong(undefined)}
        song={viewingSong}
      />
    </>
  );
}