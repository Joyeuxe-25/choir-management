'use client';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/SearchBar';
import FilterBar from '@/components/shared/FilterBar';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import SongList from '@/components/songs/SongList';
import SongFormModal from '@/components/songs/SongFormModal';
import SongDetailModal from '@/components/songs/SongDetailModal';
import { songs as initialSongs } from '@/data/songs';
import { Song } from '@/types';

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [voiceFilter, setVoiceFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | undefined>(undefined);
  const [viewingSong, setViewingSong] = useState<Song | undefined>(undefined);

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

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? song.category === categoryFilter : true;
      const matchesVoice = voiceFilter ? song.voice === voiceFilter : true;
      const matchesLanguage = languageFilter ? song.language === languageFilter : true;
      return matchesSearch && matchesCategory && matchesVoice && matchesLanguage;
    });
  }, [songs, searchQuery, categoryFilter, voiceFilter, languageFilter]);

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

  const handleSaveSong = (songData: Omit<Song, 'id' | 'uploadDate' | 'uploadedBy'>) => {
    if (editingSong) {
      setSongs(songs.map(s => s.id === editingSong.id ? { ...editingSong, ...songData } : s));
    } else {
      const newId = String(Math.max(...songs.map(s => parseInt(s.id)), 0) + 1);
      const newSong: Song = {
        id: newId,
        ...songData,
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'Current User',
        fileAttached: false,
      };
      setSongs([...songs, newSong]);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteSong = (song: Song) => {
    if (confirm(`Delete "${song.title}"?`)) {
      setSongs(songs.filter(s => s.id !== song.id));
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
      <SongList
        songs={filteredSongs}
        onEdit={handleEditSong}
        onView={handleViewSong}
        onDelete={handleDeleteSong}
      />
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