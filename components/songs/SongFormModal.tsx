'use client';
import { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import { Song } from '@/types';
import styles from './SongFormModal.module.css';

interface SongFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (song: any) => void;
  initialData?: Song;
}

const emptySong = {
  title: '',
  category: '',
  voice: '',
  language: '',
  upload_date: new Date().toISOString().split('T')[0],
};

export default function SongFormModal({ isOpen, onClose, onSave, initialData }: SongFormModalProps) {
  const [formData, setFormData] = useState(emptySong);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        category: initialData.category,
        voice: initialData.voice,
        language: initialData.language,
        upload_date: initialData.upload_date,
      });
    } else {
      setFormData(emptySong);
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const categoryOptions = [
    { value: '', label: 'Select category' },
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
    { value: '', label: 'Select voice' },
    { value: 'Full Choir', label: 'Full Choir' },
    { value: 'Soprano', label: 'Soprano' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Tenor', label: 'Tenor' },
    { value: 'Bass', label: 'Bass' },
  ];

  const languageOptions = [
    { value: '', label: 'Select language' },
    { value: 'Kinyarwanda', label: 'Kinyarwanda' },
    { value: 'English', label: 'English' },
    { value: 'French', label: 'French' },
    { value: 'Swahili', label: 'Swahili' },
    { value: 'Latin', label: 'Latin' },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{initialData ? 'Edit Song' : 'Add Song'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.twoColumns}>
            <Input label="Song Title" name="title" value={formData.title} onChange={handleChange} required />
            <Select label="Category" name="category" options={categoryOptions} value={formData.category} onChange={handleChange} required />
            <Select label="Voice" name="voice" options={voiceOptions} value={formData.voice} onChange={handleChange} required />
            <Select label="Language" name="language" options={languageOptions} value={formData.language} onChange={handleChange} required />
            <Input label="Upload Date" type="date" name="upload_date" value={formData.upload_date} onChange={handleChange} required />
          </div>
          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Song</Button>
          </div>
        </form>
      </div>
    </div>
  );
}