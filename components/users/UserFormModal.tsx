'use client';
import { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import { User, UserRole, VoiceAssignment } from '@/types';
import styles from './UserFormModal.module.css';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'createdAt'>) => void;
  initialData?: User;
}

const emptyUser = {
  name: '',
  email: '',
  role: 'voiceLeader' as UserRole,
  voice: null as VoiceAssignment,
  status: 'active' as const,
};

export default function UserFormModal({ isOpen, onClose, onSave, initialData }: UserFormModalProps) {
  const [formData, setFormData] = useState(emptyUser);

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, ...rest } = initialData;
      setFormData(rest);
    } else {
      setFormData(emptyUser);
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For voiceLeader, voice must be selected; for others, set null
    const finalData = {
      ...formData,
      voice: formData.role === 'voiceLeader' ? formData.voice : null,
    };
    onSave(finalData);
    onClose();
  };

  if (!isOpen) return null;

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'secretary', label: 'Secretary' },
    { value: 'voiceLeader', label: 'Voice Leader' },
  ];

  const voiceOptions = [
    { value: '', label: 'Select voice' },
    { value: 'Soprano', label: 'Soprano' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Tenor', label: 'Tenor' },
    { value: 'Bass', label: 'Bass' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const showVoiceField = formData.role === 'voiceLeader';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{initialData ? 'Edit User' : 'Add User'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.twoColumns}>
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
            <Select label="Role" name="role" options={roleOptions} value={formData.role} onChange={handleChange} required />
            {showVoiceField && (
              <Select label="Assigned Voice" name="voice" options={voiceOptions} value={formData.voice || ''} onChange={handleChange} required />
            )}
            <Select label="Status" name="status" options={statusOptions} value={formData.status} onChange={handleChange} required />
          </div>
          <div className={styles.passwordSection}>
            <div className={styles.twoColumns}>
              <Input label="Password (placeholder)" type="password" placeholder="••••••••" disabled />
              <Input label="Confirm Password (placeholder)" type="password" placeholder="••••••••" disabled />
            </div>
            <p className={styles.note}>Password management will be added later.</p>
          </div>
          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save User</Button>
          </div>
        </form>
      </div>
    </div>
  );
}