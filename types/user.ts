export type UserRole = 'admin' | 'secretary' | 'voiceLeader';
export type UserStatus = 'active' | 'inactive';
export type VoiceAssignment = 'Soprano' | 'Alto' | 'Tenor' | 'Bass' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  voice: VoiceAssignment;
  status: UserStatus;
  createdAt: string;
}