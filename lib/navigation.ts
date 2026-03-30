type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Members', href: '/members', icon: '👥' },
  { label: 'Attendance', href: '/attendance', icon: '✅' },
  { label: 'Songs', href: '/songs', icon: '🎵' },
  { label: 'Minutes', href: '/minutes', icon: '📝' },
  { label: 'Users', href: '/users', icon: '👤' },
];

const secretaryNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Songs', href: '/songs', icon: '🎵' },
  { label: 'Minutes', href: '/minutes', icon: '📝' },
];

const voiceLeaderNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Members', href: '/members', icon: '👥' },
  { label: 'Attendance', href: '/attendance', icon: '✅' },
  { label: 'Songs', href: '/songs', icon: '🎵' },
];

export function getNavigationForRole(role: 'admin' | 'secretary' | 'voiceLeader'): NavItem[] {
  switch (role) {
    case 'admin': return adminNav;
    case 'secretary': return secretaryNav;
    case 'voiceLeader': return voiceLeaderNav;
    default: return [];
  }
}