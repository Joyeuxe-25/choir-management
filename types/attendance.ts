export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  voice: string;
  date: string;
  eventType: string;
  status: 'present' | 'absent' | 'excused';
  markedBy: string;
  note?: string;
}