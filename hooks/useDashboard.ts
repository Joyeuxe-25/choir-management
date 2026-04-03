import { useState, useEffect, useCallback } from 'react';

const BACKEND_URL = 'https://choir-backend.movie-night-api.workers.dev';

export interface DashboardData {
  summary: {
    total_members: number;
    soprano: number;
    alto: number;
    tenor: number;
    bass: number;
    total_songs: number;
    present_today: number;
  };
  today_attendance: {
    present: number;
    absent: number;
    excused: number;
    late: number;
  };
  upcoming_events: {
    id: number;
    title: string;
    event_type: string;
    event_date: string;
    event_time?: string;
    location?: string;
  }[];
  recent_minutes: {
    id: number;
    title: string;
    meeting_date: string;
    recorded_by_name: string;
  }[];
  recent_songs: {
    id: number;
    title: string;
    category: string;
    language: string;
    upload_date: string;
    file_present: boolean;
  }[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json = await res.json();
      setData(json.data ?? json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}