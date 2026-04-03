'use client';
import { useState, useEffect } from 'react';
import Select from '@/components/shared/Select';
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
  { value: 'Present', label: 'Present' },
  { value: 'Absent', label: 'Absent' },
  { value: 'Excused', label: 'Excused' },
  { value: 'Late', label: 'Late' },
];

export default function EditAttendanceModal({ isOpen, onClose, onSave, initialData }: EditAttendanceModalProps) {
  const [status, setStatus] = useState<'Present' | 'Absent' | 'Excused' | 'Late'>('Present');

  useEffect(() => {
    if (initialData) {
      // normalize in case old records have lowercase
      const normalized = initialData.status.charAt(0).toUpperCase() + initialData.status.slice(1).toLowerCase();
      setStatus(normalized as any);
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
  if (!initialData) return;
  onSave({ ...initialData, status: status.toLowerCase() as any });
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
          <p><strong>Member:</strong> {initialData.member_name}</p>
          <p><strong>Date:</strong> {initialData.date}</p>
          <p><strong>Event:</strong> {initialData.event_type}</p>
          <Select label="Status" options={statusOptions} value={status} onChange={(e) => setStatus(e.target.value as any)} />
          <div className={styles.actions}>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}