'use client';

import StatCard from '@/components/shared/StatCard';
import { useDashboard } from '@/hooks/useDashboard';
import styles from './DashboardStats.module.css';

interface DashboardStatsProps {
  showMemberStats?: boolean;
  showSongStats?: boolean;
  showAttendanceStats?: boolean;
}

export default function DashboardStats({
  showMemberStats = true,
  showSongStats = true,
  showAttendanceStats = true,
}: DashboardStatsProps) {
  const { data, loading, error } = useDashboard();

  const s = data?.summary;

  const val = (n?: number) => {
    if (loading) return '…';
    if (error || n === undefined) return '—';
    return n;
  };

  return (
    <div className={styles.statsGrid}>
      {showMemberStats && (
        <>
          <StatCard title="Total Members" value={val(s?.total_members)} icon="👥" />
          <StatCard title="Soprano"       value={val(s?.soprano)}       icon="🎤" />
          <StatCard title="Alto"          value={val(s?.alto)}          icon="🎤" />
          <StatCard title="Tenor"         value={val(s?.tenor)}         icon="🎤" />
          <StatCard title="Bass"          value={val(s?.bass)}          icon="🎤" />
        </>
      )}
      {showSongStats && (
        <StatCard title="Total Songs" value={val(s?.total_songs)} icon="🎵" />
      )}
      {showAttendanceStats && (
        <>
          <StatCard title="Present Today"       value={val(s?.present_today)}                    icon="✅" />
          <StatCard title="Upcoming Rehearsals" value={val(data?.upcoming_rehearsals?.length ?? 0)} icon="📅" />
        </>
      )}
    </div>
  );
}