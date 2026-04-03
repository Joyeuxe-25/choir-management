'use client';
import { useState, useEffect, useRef } from 'react';
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
  isSaving?: boolean;
}

const emptyMinute = {
  title: '',
  meeting_date: new Date().toISOString().split('T')[0],
  content: '',
};

export default function MinuteFormModal({ isOpen, onClose, onSave, initialData, isSaving }: MinuteFormModalProps) {
  const [formData, setFormData] = useState(emptyMinute);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, file });
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
          <div className={styles.fileUpload}>
            <label className={styles.fileLabel}>
              Attachment <span className={styles.optional}>(PDF or DOC, max 800KB)</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            {file && (
              <p className={styles.fileName}>📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
            )}
            {!file && initialData?.attachment_present && (
              <p className={styles.fileName}>📄 {initialData.attachment_name || 'File already attached'} — upload a new one to replace it</p>
            )}
          </div>
          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Minutes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}