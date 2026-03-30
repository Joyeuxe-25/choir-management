'use client';
import { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Textarea from '@/components/shared/Textarea';
import Button from '@/components/shared/Button';
import { members } from '@/data/members';
import { eventTypes } from '@/data/eventTypes';
import { AttendanceRecord } from '@/types';
import styles from './MarkAttendanceModal.module.css';

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (records: Omit<AttendanceRecord, 'id'>[]) => void;
}

interface MemberAttendance {
  memberId: string;
  memberName: string;
  voice: string;
  status: 'present' | 'absent' | 'excused';
  note: string;
}

export default function MarkAttendanceModal({ isOpen, onClose, onSave }: MarkAttendanceModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventType, setEventType] = useState(eventTypes[0]);
  const [voiceFilter, setVoiceFilter] = useState('');
  const [memberStatuses, setMemberStatuses] = useState<MemberAttendance[]>([]);
  const [globalNote, setGlobalNote] = useState('');

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
  ];

  // Filter members based on selected voice
  const filteredMembers = members.filter(m => voiceFilter ? m.voice === voiceFilter : true);

  // Initialize memberStatuses when voiceFilter changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const initial = filteredMembers.map(m => ({
        memberId: m.id,
        memberName: m.name,
        voice: m.voice,
        status: 'present' as const,
        note: '',
      }));
      setMemberStatuses(initial);
    }
  }, [isOpen, voiceFilter, filteredMembers]);

  const updateMemberStatus = (memberId: string, status: 'present' | 'absent' | 'excused') => {
    setMemberStatuses(prev =>
      prev.map(m => m.memberId === memberId ? { ...m, status } : m)
    );
  };

  const updateMemberNote = (memberId: string, note: string) => {
    setMemberStatuses(prev =>
      prev.map(m => m.memberId === memberId ? { ...m, note } : m)
    );
  };

  const handleSubmit = () => {
    const records = memberStatuses.map(ms => ({
      memberId: ms.memberId,
      memberName: ms.memberName,
      voice: ms.voice,
      date,
      eventType,
      status: ms.status,
      markedBy: 'Current User', // dummy
      note: ms.note || globalNote,
    }));
    onSave(records);
    onClose();
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
          <Textarea label="Global Note (applies to all)" value={globalNote} onChange={(e) => setGlobalNote(e.target.value)} rows={2} />
          <div className={styles.membersSection}>
            <h3>Members</h3>
            {memberStatuses.map(member => (
              <div key={member.memberId} className={styles.memberRow}>
                <div className={styles.memberInfo}>
                  <span className={styles.memberName}>{member.memberName}</span>
                  <span className={styles.memberVoice}>{member.voice}</span>
                </div>
                <div className={styles.statusSelect}>
                  <Select
                    options={statusOptions}
                    value={member.status}
                    onChange={(e) => updateMemberStatus(member.memberId, e.target.value as any)}
                  />
                </div>
                <Input
                  placeholder="Individual note"
                  value={member.note}
                  onChange={(e) => updateMemberNote(member.memberId, e.target.value)}
                  className={styles.noteInput}
                />
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