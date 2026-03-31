export type VoiceType = 'Soprano' | 'Alto' | 'Tenor' | 'Bass';

export interface Member {
  id: string;
  name: string;
  voice: VoiceType;
  email?: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
  gender?: string;
  address?: string;
  notes?: string;
}