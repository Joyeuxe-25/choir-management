export interface Minute {
  id: string;
  title: string;
  meeting_date: string;
  content?: string;
  recorded_by_id?: string;
  recorded_by_name?: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_present?: boolean;
  created_at?: string;
  updated_at?: string;
}