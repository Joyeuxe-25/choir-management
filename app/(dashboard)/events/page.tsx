'use client';
import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/SearchBar';
import FilterBar from '@/components/shared/FilterBar';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import EventList from '@/components/events/EventList';
import EventFormModal from '@/components/events/EventFormModal';
import EventDetailModal from '@/components/events/EventDetailModal';
import { eventsApi } from '@/lib/api';
import { useRole } from '@/context/RoleContext';

export interface Event {
  id: number;
  title: string;
  event_type: string;
  event_date: string;
  event_time?: string;
  location?: string;
  description?: string;
  created_by_name?: string;
  created_at?: string;
  updated_at?: string;
}

export default function EventsPage() {
  const { role } = useRole();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
  const [viewingEvent, setViewingEvent] = useState<Event | undefined>(undefined);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setError('');
      const params: Record<string, string> = {};
      if (typeFilter) params.event_type = typeFilter;
      if (upcomingOnly) params.upcoming = 'true';
      const res = await eventsApi.getAll(params);
      setEvents(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, [typeFilter, upcomingOnly]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events;
    return events.filter(e =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.event_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [events, searchQuery]);

  const canManage = role === 'admin' || role === 'secretary';

  const typeOptions = [
    { value: '', label: 'All types' },
    { value: 'Rehearsal', label: 'Rehearsal' },
    { value: 'Sunday Service', label: 'Sunday Service' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Special Event', label: 'Special Event' },
    { value: 'Concert', label: 'Concert' },
    { value: 'Wedding', label: 'Wedding' },
    { value: 'Funeral', label: 'Funeral' },
  ];

  const upcomingOptions = [
    { value: 'false', label: 'All events' },
    { value: 'true', label: 'Upcoming only' },
  ];

  return (
    <>
      <PageHeader
        title="Events"
        description="Manage choir events and upcoming rehearsals."
        actions={
          canManage
            ? <Button variant="primary" onClick={() => { setEditingEvent(undefined); setIsFormModalOpen(true); }}>+ Add Event</Button>
            : undefined
        }
      />
      <FilterBar title="Filters">
        <SearchBar placeholder="Search by title..." onSearch={setSearchQuery} />
        <Select label="Type" options={typeOptions} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} />
        <Select
          label="Show"
          options={upcomingOptions}
          value={upcomingOnly ? 'true' : 'false'}
          onChange={(e) => setUpcomingOnly(e.target.value === 'true')}
        />
      </FilterBar>
      {isLoading && <p style={{ padding: '1rem' }}>Loading events...</p>}
      {error && <p style={{ padding: '1rem', color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <EventList
          events={filteredEvents}
          onEdit={canManage ? (e) => { setEditingEvent(e); setIsFormModalOpen(true); } : () => {}}
          onView={(e) => setViewingEvent(e)}
          onDelete={canManage ? async (event) => {
            if (!confirm(`Delete "${event.title}"?`)) return;
            try {
              await eventsApi.delete(String(event.id));
              loadEvents();
            } catch (err: any) {
              alert(err.message || 'Failed to delete event');
            }
          } : () => {}}
          canManage={canManage}
        />
      )}
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={async (eventData) => {
          try {
            if (editingEvent) {
              await eventsApi.update(String(editingEvent.id), eventData);
            } else {
              await eventsApi.create(eventData);
            }
            setIsFormModalOpen(false);
            loadEvents();
          } catch (err: any) {
            alert(err.message || 'Failed to save event');
          }
        }}
        initialData={editingEvent}
      />
      <EventDetailModal
        isOpen={!!viewingEvent}
        onClose={() => setViewingEvent(undefined)}
        event={viewingEvent}
      />
    </>
  );
}