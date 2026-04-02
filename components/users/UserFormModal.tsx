'use client';
import { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import { User } from '@/types';
import styles from './UserFormModal.module.css';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: any) => void;
  initialData?: User;
}

const emptyUser = {
  name: '',
  email: '',
  password: '',
  role: 'VoiceLeader',
  voice: '',
  status: 'Active',
};

export default function UserFormModal({ isOpen, onClose, onSave, initialData }: UserFormModalProps) {
  const [formData, setFormData] = useState(emptyUser);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        password: '',
        role: initialData.role,
        voice: initialData.voice || '',
        status: initialData.status,
      });
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
    const payload: any = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      voice: formData.role === 'VoiceLeader' ? formData.voice : null,
      status: formData.status,
    };
    // Only include password if provided
    if (formData.password) {
      payload.password = formData.password;
    }
    // Password required for new users
    if (!initialData && !formData.password) {
      alert('Password is required for new users');
      return;
    }
    onSave(payload);
  };

  if (!isOpen) return null;

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Secretary', label: 'Secretary' },
    { value: 'VoiceLeader', label: 'Voice Leader' },
  ];

  const voiceOptions = [
    { value: '', label: 'Select voice' },
    { value: 'Soprano', label: 'Soprano' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Tenor', label: 'Tenor' },
    { value: 'Bass', label: 'Bass' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  const showVoiceField = formData.role === 'VoiceLeader';

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
              <Select label="Assigned Voice" name="voice" options={voiceOptions} value={formData.voice} onChange={handleChange} required />
            )}
            <Select label="Status" name="status" options={statusOptions} value={formData.status} onChange={handleChange} required />
          </div>
          <div className={styles.passwordSection}>
            <div className={styles.twoColumns}>
              <Input
                label={initialData ? 'New Password (leave blank to keep)' : 'Password'}
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required={!initialData}
              />
            </div>
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