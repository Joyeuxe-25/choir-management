'use client';
import { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import Textarea from '@/components/shared/Textarea';
import { Event } from '@/app/(dashboard)/events/page';
import styles from './EventFormModal.module.css';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: any) => void;
  initialData?: Event;
}

const emptyEvent = {
  title: '',
  event_type: '',
  event_date: new Date().toISOString().split('T')[0],
  event_time: '',
  location: '',
  description: '',
};

export default function EventFormModal({ isOpen, onClose, onSave, initialData }: EventFormModalProps) {
  const [formData, setFormData] = useState(emptyEvent);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        event_type: initialData.event_type,
        event_date: initialData.event_date,
        event_time: initialData.event_time || '',
        location: initialData.location || '',
        description: initialData.description || '',
      });
    } else {
      setFormData(emptyEvent);
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const typeOptions = [
    { value: '', label: 'Select type' },
    { value: 'Rehearsal', label: 'Rehearsal' },
    { value: 'Sunday Service', label: 'Sunday Service' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Special Event', label: 'Special Event' },
    { value: 'Concert', label: 'Concert' },
    { value: 'Wedding', label: 'Wedding' },
    { value: 'Funeral', label: 'Funeral' },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{initialData ? 'Edit Event' : 'Add Event'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.twoColumns}>
            <Input label="Event Title" name="title" value={formData.title} onChange={handleChange} required />
            <Select label="Event Type" name="event_type" options={typeOptions} value={formData.event_type} onChange={handleChange} required />
            <Input label="Date" type="date" name="event_date" value={formData.event_date} onChange={handleChange} required />
            <Input label="Time (optional)" type="time" name="event_time" value={formData.event_time} onChange={handleChange} />
            <Input label="Location (optional)" name="location" value={formData.location} onChange={handleChange} />
          </div>
          <Textarea label="Description (optional)" name="description" value={formData.description} onChange={handleChange} rows={4} />
          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Event</Button>
          </div>
        </form>
      </div>
    </div>
  );
}