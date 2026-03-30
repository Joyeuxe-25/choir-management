import StatCard from '@/components/shared/StatCard';
import { dashboardStats, membersByVoice } from '@/data/dashboard';
import styles from './DashboardStats.module.css';

interface DashboardStatsProps {
  showMemberStats?: boolean;
  showSongStats?: boolean;
  showAttendanceStats?: boolean;
}

export default function DashboardStats({ showMemberStats = true, showSongStats = true, showAttendanceStats = true }: DashboardStatsProps) {
  return (
    <div className={styles.statsGrid}>
      {showMemberStats && (
        <>
          <StatCard title="Total Members" value={dashboardStats.totalMembers} icon="👥" />
          <StatCard title="Soprano" value={membersByVoice.Soprano} icon="🎤" />
          <StatCard title="Alto" value={membersByVoice.Alto} icon="🎤" />
          <StatCard title="Tenor" value={membersByVoice.Tenor} icon="🎤" />
          <StatCard title="Bass" value={membersByVoice.Bass} icon="🎤" />
        </>
      )}
      {showSongStats && (
        <StatCard title="Total Songs" value={dashboardStats.songsInLibrary} icon="🎵" />
      )}
      {showAttendanceStats && (
        <>
          <StatCard title="Present Today" value={dashboardStats.presentToday} icon="✅" />
          <StatCard title="Upcoming Rehearsals" value={dashboardStats.upcomingRehearsals} icon="📅" />
        </>
      )}
    </div>
  );
}