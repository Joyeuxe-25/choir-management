export type UserRole = 'Admin' | 'Secretary' | 'Voice Leader';
export type UserStatus = 'Active' | 'Inactive';
export type VoiceAssignment = 'Soprano' | 'Alto' | 'Tenor' | 'Bass' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  voice: VoiceAssignment;
  status: UserStatus;
  created_at: string;
}