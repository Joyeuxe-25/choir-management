'use client';
import { useRole } from '@/context/RoleContext';
import PageHeader from '@/components/shared/PageHeader';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import QuickActions from '@/components/Dashboard/QuickActions';
import VoiceSummary from '@/components/Dashboard/VoiceSummary';
import RecentMinutesPreview from '@/components/Dashboard/RecentMinutesPreview';
import RecentSongsPreview from '@/components/Dashboard/RecentSongsPreview';
import AttendanceOverview from '@/components/Dashboard/AttendanceOverview';
import SectionCard from '@/components/shared/SectionCard';
import styles from './page.module.css';

export default function DashboardPage() {
  const { role } = useRole();

  // Render different content based on role
  const renderAdminDashboard = () => (
    <>
      <DashboardStats />
      <div className={styles.twoColumns}>
        <div>
          <VoiceSummary />
          <RecentMinutesPreview />
        </div>
        <div>
          <AttendanceOverview />
          <RecentSongsPreview />
        </div>
      </div>
      <QuickActions role="admin" />
    </>
  );

  const renderSecretaryDashboard = () => (
    <>
      <DashboardStats showMemberStats={false} showSongStats />
      <div className={styles.twoColumns}>
        <RecentMinutesPreview />
        <RecentSongsPreview />
      </div>
      <QuickActions role="secretary" />
    </>
  );

  const renderVoiceLeaderDashboard = () => (
    <>
      <DashboardStats showMemberStats showAttendanceStats showSongStats={false} />
      <div className={styles.twoColumns}>
        <VoiceSummary />
        <AttendanceOverview />
      </div>
      <RecentSongsPreview limit={3} />
      <QuickActions role="voiceLeader" />
    </>
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back! Here's an overview of your ${role} dashboard.`}
      />
      {role === 'admin' && renderAdminDashboard()}
      {role === 'secretary' && renderSecretaryDashboard()}
      {role === 'voiceLeader' && renderVoiceLeaderDashboard()}
    </>
  );
}