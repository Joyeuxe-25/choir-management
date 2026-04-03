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
  onSave: (minute: any) => void;
  initialData?: Minute;
}

const emptyMinute = {
  title: '',
  meeting_date: new Date().toISOString().split('T')[0],
  content: '',
};

export default function MinuteFormModal({ isOpen, onClose, onSave, initialData }: MinuteFormModalProps) {
  const [formData, setFormData] = useState(emptyMinute);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        meeting_date: initialData.meeting_date,
        content: initialData.content || '',
      });
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
            <Input label="Meeting Date" type="date" name="meeting_date" value={formData.meeting_date} onChange={handleChange} required />
          </div>
          <Textarea label="Content / Minutes" name="content" value={formData.content} onChange={handleChange} rows={6} />
          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Minutes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}