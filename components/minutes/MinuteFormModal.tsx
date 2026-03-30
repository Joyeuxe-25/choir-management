'use client';
import { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';
import Textarea from '@/components/shared/Textarea';
import Button from '@/components/shared/Button';
import { Minute } from '@/types';
import styles from './MinuteFormModal.module.css';

interface MinuteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (minute: Omit<Minute, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Minute;
}

const emptyMinute = {
  title: '',
  meetingDate: new Date().toISOString().split('T')[0],
  content: '',
  recordedBy: '',
  hasAttachment: false,
};

export default function MinuteFormModal({ isOpen, onClose, onSave, initialData }: MinuteFormModalProps) {
  const [formData, setFormData] = useState(emptyMinute);

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, ...rest } = initialData;
      setFormData(rest);
    } else {
      setFormData(emptyMinute);
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{initialData ? 'Edit Minutes' : 'Add Minutes'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.twoColumns}>
            <Input label="Meeting Title" name="title" value={formData.title} onChange={handleChange} required />
            <Input label="Meeting Date" type="date" name="meetingDate" value={formData.meetingDate} onChange={handleChange} required />
            <Input label="Recorded By" name="recordedBy" value={formData.recordedBy} onChange={handleChange} required />
          </div>
          <Textarea label="Content / Minutes" name="content" value={formData.content} onChange={handleChange} rows={6} required />
          <div className={styles.fileSection}>
            <label className={styles.fileLabel}>Attachment (placeholder)</label>
            <div className={styles.filePlaceholder}>
              <span>📎</span>
              <span>No file selected. Upload will be available later.</span>
              <button type="button" className={styles.uploadButton} disabled>Choose File</button>
            </div>
          </div>
          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Minutes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}