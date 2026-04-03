'use client';
import { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import { membersApi } from '@/lib/api';
import { eventTypes } from '@/data/eventTypes';
import styles from './MarkAttendanceModal.module.css';

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (records: any[]) => void;
}

interface MemberAttendance {
  member_id: string;
  member_name: string;
  voice: string;
  status: 'present' | 'absent' | 'excused' | 'late';
}

export default function MarkAttendanceModal({ isOpen, onClose, onSave }: MarkAttendanceModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventType, setEventType] = useState(eventTypes[0]);
  const [voiceFilter, setVoiceFilter] = useState('');
  const [memberStatuses, setMemberStatuses] = useState<MemberAttendance[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const voiceOptions = [
    { value: '', label: 'All voices' },
    { value: 'Soprano', label: 'Soprano' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Tenor', label: 'Tenor' },
    { value: 'Bass', label: 'Bass' },
  ];

  const eventOptions = eventTypes.map(et => ({ value: et, label: et }));

  const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'excused', label: 'Excused' },
    { value: 'late', label: 'Late' },
  ];

  useEffect(() => {
    if (isOpen) {
      loadMembers();
    }
  }, [isOpen, voiceFilter]);

  const loadMembers = async () => {
    try {
      setIsLoadingMembers(true);
      const params: Record<string, string> = { status: 'Active' };
      if (voiceFilter) params.voice = voiceFilter;
      const res = await membersApi.getAll(params);
      const initial = (res.data || []).map((m: any) => ({
        member_id: String(m.id),
        member_name: m.name,
        voice: m.voice,
        status: 'present' as const,
      }));
      setMemberStatuses(initial);
    } catch (err) {
      console.error('Failed to load members');
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const updateMemberStatus = (member_id: string, status: 'present' | 'absent' | 'excused' | 'late') => {
    setMemberStatuses(prev =>
      prev.map(m => m.member_id === member_id ? { ...m, status } : m)
    );
  };

  const handleSubmit = () => {
    const records = memberStatuses.map(ms => ({
      member_id: ms.member_id,
      date,
      event_type: eventType,
      status: ms.status,
    }));
    onSave(records);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Mark Attendance</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.form}>
          <div className={styles.twoColumns}>
            <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <Select label="Event Type" options={eventOptions} value={eventType} onChange={(e) => setEventType(e.target.value)} required />
            <Select label="Filter by Voice" options={voiceOptions} value={voiceFilter} onChange={(e) => setVoiceFilter(e.target.value)} />
          </div>
          <div className={styles.membersSection}>
            <h3>Members</h3>
            {isLoadingMembers && <p>Loading members...</p>}
            {!isLoadingMembers && memberStatuses.map(member => (
              <div key={member.member_id} className={styles.memberRow}>
                <div className={styles.memberInfo}>
                  <span className={styles.memberName}>{member.member_name}</span>
                  <span className={styles.memberVoice}>{member.voice}</span>
                </div>
                <div className={styles.statusSelect}>
                  <Select
                    options={statusOptions}
                    value={member.status}
                    onChange={(e) => updateMemberStatus(member.member_id, e.target.value as any)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save Attendance</Button>
          </div>
        </div>
      </div>
    </div>
  );
}