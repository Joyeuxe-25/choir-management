import { User } from '@/types';

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    voice: null,
    status: 'Active',
    created_at: '2025-01-10T08:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Secretary',
    voice: null,
    status: 'Active',
    created_at: '2025-01-15T09:30:00Z',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    role: 'Voice Leader',
    voice: 'Tenor',
    status: 'Active',
    created_at: '2025-02-01T10:15:00Z',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'Voice Leader',
    voice: 'Soprano',
    status: 'Inactive',
    created_at: '2025-02-10T11:45:00Z',
  },
];