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
import { Song } from '@/types';

export default function SongsPage() {
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

  const loadSongs = async () => {
    try {
      setIsLoading(true);
      setError('');
      const params: Record<string, string> = {};
      if (categoryFilter) params.category = categoryFilter;
      if (voiceFilter) params.voice = voiceFilter;
      if (languageFilter) params.language = languageFilter;
      if (searchQuery) params.title = searchQuery;
      const res = await songsApi.getAll(params);
      setSongs(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load songs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, [categoryFilter, voiceFilter, languageFilter]);

  const filteredSongs = useMemo(() => {
    if (!searchQuery) return songs;
    return songs.filter(s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [songs, searchQuery]);

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

  const handleAddSong = () => {
    setEditingSong(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setIsFormModalOpen(true);
  };

  const handleViewSong = (song: Song) => {
    setViewingSong(song);
  };

  const handleSaveSong = async (songData: any) => {
    try {
      if (editingSong) {
        await songsApi.update(String(editingSong.id), songData);
      } else {
        await songsApi.create(songData);
      }
      setIsFormModalOpen(false);
      loadSongs();
    } catch (err: any) {
      alert(err.message || 'Failed to save song');
    }
  };

  const handleDeleteSong = async (song: Song) => {
    if (confirm(`Delete "${song.title}"?`)) {
      try {
        await songsApi.delete(String(song.id));
        loadSongs();
      } catch (err: any) {
        alert(err.message || 'Failed to delete song');
      }
    }
  };

  return (
    <>
      <PageHeader
        title="Songs"
        description="Manage choir song library."
        actions={<Button variant="primary" onClick={handleAddSong}>+ Add Song</Button>}
      />
      <FilterBar title="Filters">
        <SearchBar placeholder="Search by title..." onSearch={setSearchQuery} />
        <Select label="Category" options={categoryOptions} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
        <Select label="Voice" options={voiceOptions} value={voiceFilter} onChange={(e) => setVoiceFilter(e.target.value)} />
        <Select label="Language" options={languageOptions} value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} />
      </FilterBar>
      {isLoading && <p style={{ padding: '1rem' }}>Loading songs...</p>}
      {error && <p style={{ padding: '1rem', color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <SongList
          songs={filteredSongs}
          onEdit={handleEditSong}
          onView={handleViewSong}
          onDelete={handleDeleteSong}
        />
      )}
      <SongFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveSong}
        initialData={editingSong}
      />
      <SongDetailModal
        isOpen={!!viewingSong}
        onClose={() => setViewingSong(undefined)}
        song={viewingSong}
      />
    </>
  );
}