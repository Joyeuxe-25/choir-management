import StatCard from '@/components/shared/StatCard';
import { dashboardStats, membersByVoice } from '@/data/dashboard';
import { attendanceRecords } from '@/data/attendance';
import { members } from '@/data/members';
import { songs } from '@/data/songs';
import styles from './DashboardStats.module.css';

interface DashboardStatsProps {
  showMemberStats?: boolean;
  showSongStats?: boolean;
  showAttendanceStats?: boolean;
}

export default function DashboardStats({ showMemberStats = true, showSongStats = true, showAttendanceStats = true }: DashboardStatsProps) {
  // Calculate real counts
  const totalMembers = members.length;
  const totalSongs = songs.length;

  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceRecords.filter(r => r.date === today);
  const latestDate = todayRecords.length > 0
    ? today
    : attendanceRecords.reduce((latest, r) => r.date > latest ? r.date : latest, '');
  const relevantRecords = attendanceRecords.filter(r => r.date === latestDate);
  const presentToday = relevantRecords.filter(r => r.status === 'present').length;

  const voiceCounts = {
    Soprano: members.filter(m => m.voice === 'Soprano').length,
    Alto: members.filter(m => m.voice === 'Alto').length,
    Tenor: members.filter(m => m.voice === 'Tenor').length,
    Bass: members.filter(m => m.voice === 'Bass').length,
  };

  return (
    <div className={styles.statsGrid}>
      {showMemberStats && (
        <>
          <StatCard title="Total Members" value={totalMembers} icon="👥" />
          <StatCard title="Soprano" value={voiceCounts.Soprano} icon="🎤" />
          <StatCard title="Alto" value={voiceCounts.Alto} icon="🎤" />
          <StatCard title="Tenor" value={voiceCounts.Tenor} icon="🎤" />
          <StatCard title="Bass" value={voiceCounts.Bass} icon="🎤" />
        </>
      )}
      {showSongStats && (
        <StatCard title="Total Songs" value={totalSongs} icon="🎵" />
      )}
      {showAttendanceStats && (
        <>
          <StatCard title="Present Today" value={presentToday} icon="✅" />
          <StatCard title="Upcoming Rehearsals" value={dashboardStats.upcomingRehearsals} icon="📅" />
        </>
      )}
    </div>
  );
}