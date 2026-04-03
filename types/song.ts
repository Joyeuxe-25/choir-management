export type SongCategory = 'Worship' | 'Praise' | 'Entrance' | 'Offertory' | 'Communion' | 'Closing' | 'Practice' | 'Special Event' | 'Christmas' | 'Easter' | 'Wedding' | 'Funeral';
export type SongVoice = 'Full Choir' | 'Soprano' | 'Alto' | 'Tenor' | 'Bass';
export type SongLanguage = 'Kinyarwanda' | 'English' | 'French' | 'Swahili' | 'Latin';

export interface Song {
  id: string;
  title: string;
  category: SongCategory | string;
  voice: SongVoice | string;
  language: SongLanguage | string;
  upload_date: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  file_present?: boolean;
  created_at?: string;
  updated_at?: string;
}