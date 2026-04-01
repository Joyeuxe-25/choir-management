'use client';
import { useState, useEffect } from 'react';
import Select from '@/components/shared/Select';
import Textarea from '@/components/shared/Textarea';
import Button from '@/components/shared/Button';
import { AttendanceRecord } from '@/types';
import styles from './EditAttendanceModal.module.css';

interface EditAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: AttendanceRecord) => void;
  initialData?: AttendanceRecord;
}

const statusOptions = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'excused', label: 'Excused' },
  { value: 'late', label: 'Late' },
];

export default function EditAttendanceModal({ isOpen, onClose, onSave, initialData }: EditAttendanceModalProps) {
  const [status, setStatus] = useState<'present' | 'absent' | 'excused' | 'late'>('present');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (initialData) {
      setStatus(initialData.status);
      setNote(initialData.note || '');
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!initialData) return;
    const updated = { ...initialData, status, note };
    onSave(updated);
    onClose();
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Edit Attendance</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.form}>
          <p><strong>Member:</strong> {initialData.memberName}</p>
          <p><strong>Date:</strong> {initialData.date}</p>
          <p><strong>Event:</strong> {initialData.eventType}</p>
          <Select label="Status" options={statusOptions} value={status} onChange={(e) => setStatus(e.target.value as any)} />
          <Textarea label="Note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
          <div className={styles.actions}>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}