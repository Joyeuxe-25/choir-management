'use client';
import { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Textarea from '@/components/shared/Textarea';
import Button from '@/components/shared/Button';
import { Member } from '@/types';
import styles from './MemberFormModal.module.css';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Omit<Member, 'id'>) => void;
  initialData?: Member;
}

const emptyMember: Omit<Member, 'id'> = {
  name: '',
  gender: '',
  phone: '',
  email: '',
  voice: 'Soprano',
  joinDate: new Date().toISOString().split('T')[0],
  status: 'active',
  address: '',
  notes: '',
};

export default function MemberFormModal({ isOpen, onClose, onSave, initialData }: MemberFormModalProps) {
  const [formData, setFormData] = useState(emptyMember);

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData(rest);
    } else {
      setFormData(emptyMember);
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const voiceOptions = [
    { value: 'Soprano', label: 'Soprano' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Tenor', label: 'Tenor' },
    { value: 'Bass', label: 'Bass' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const genderOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' },
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
            <Select label="Gender" name="gender" options={genderOptions} value={formData.gender} onChange={handleChange} required />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
            <Select label="Voice" name="voice" options={voiceOptions} value={formData.voice} onChange={handleChange} required />
            <Input label="Join Date" type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} required />
            <Select label="Status" name="status" options={statusOptions} value={formData.status} onChange={handleChange} required />
          </div>
          <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
          <Textarea label="Notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Member</Button>
          </div>
        </form>
      </div>
    </div>
  );
}