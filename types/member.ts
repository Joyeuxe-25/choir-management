export type VoiceType = 'Soprano' | 'Alto' | 'Tenor' | 'Bass';

export interface Member {
  id: string;
  name: string;
  voice: VoiceType;
  phone: string;
  join_date: string;
  status: 'Active' | 'Inactive';
}