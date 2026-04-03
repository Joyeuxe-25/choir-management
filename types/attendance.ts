export interface AttendanceRecord {
  id: string;
  member_id: string;
  member_name: string;
  member_voice: string;
  date: string;
  event_type: string;
  status: 'present' | 'absent' | 'excused' | 'late';
  marked_by_name?: string;
  created_at?: string;
  updated_at?: string;
}