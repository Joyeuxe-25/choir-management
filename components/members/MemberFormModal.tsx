'use client';
import { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import { useRole } from '@/context/RoleContext';
import { Member } from '@/types';
import styles from './MemberFormModal.module.css';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: any) => void;
  initialData?: Member;
}

const emptyMember = {
  name: '',
  voice: '',
  phone: '',
  join_date: new Date().toISOString().split('T')[0],
  status: 'Active',
};

export default function MemberFormModal({ isOpen, onClose, onSave, initialData }: MemberFormModalProps) {
  const { role, voiceSection } = useRole();
  const [formData, setFormData] = useState(emptyMember);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        voice: initialData.voice,
        phone: initialData.phone || '',
        join_date: initialData.join_date,
        status: initialData.status,
      });
    } else {
      setFormData({
        ...emptyMember,
        // Pre-fill voice for voice leaders
        voice: role === 'voiceLeader' && voiceSection ? voiceSection : '',
      });
    }
  }, [initialData, isOpen, role, voiceSection]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  // Voice leaders only see their own section
  const allVoiceOptions = [
    { value: '', label: 'Select voice' },
    { value: 'Soprano', label: 'Soprano' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Tenor', label: 'Tenor' },
    { value: 'Bass', label: 'Bass' },
  ];

  const voiceOptions = role === 'voiceLeader' && voiceSection
    ? [{ value: voiceSection, label: voiceSection }]
    : allVoiceOptions;

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{initialData ? 'Edit Member' : 'Add Member'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.twoColumns}>
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <Select
              label="Voice"
              name="voice"
              options={voiceOptions}
              value={formData.voice}
              onChange={handleChange}
              required
            />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Join Date" type="date" name="join_date" value={formData.join_date} onChange={handleChange} required />
            <Select label="Status" name="status" options={statusOptions} value={formData.status} onChange={handleChange} required />
          </div>
          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Member</Button>
          </div>
        </form>
      </div>
    </div>
  );
}