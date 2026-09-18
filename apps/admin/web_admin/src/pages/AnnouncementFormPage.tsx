import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, getErrorMessage } from '../lib/api';
import type { AdminAnnouncement, AnnouncementPayload, AnnouncementPriority } from '../types';
import { PageHeader, Field, ErrorBanner, Spinner } from '../components/ui';

const PRIORITIES: AnnouncementPriority[] = ['low', 'medium', 'high', 'urgent'];

function toDatetimeLocal(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function AnnouncementFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: existing, isFetching } = useQuery({
    queryKey: ['admin', 'announcement', id],
    queryFn: async (): Promise<AdminAnnouncement | null> => {
      if (!id) return null;
      const { data: res } = await api.get(`/announcements/${id}`);
      return res.data as AdminAnnouncement;
    },
    enabled: isEdit,
  });

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('medium');
  const [body, setBody] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (existing && !loaded) {
    setTitle(existing.title);
    setPriority(existing.priority);
    setBody(existing.body);
    setExpiresAt(toDatetimeLocal(existing.expiresAt));
    setLoaded(true);
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload: AnnouncementPayload = {
        title,
        priority,
        body,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      };
      if (isEdit && id) {
        await api.patch(`/announcements/${id}`, payload);
      } else {
        await api.post('/announcements', payload);
      }
      navigate('/announcements');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save announcement'));
      setSubmitting(false);
    }
  };

  return (
    <div className="page-narrow">
      <PageHeader
        title={isEdit ? 'Edit announcement' : 'New announcement'}
        subtitle={isEdit ? 'Update the announcement' : 'Create an announcement for the campus'}
      />
      {isFetching ? <Spinner label="Loading announcement…" /> : null}
      {!isFetching && (
        <form className="card form-card" onSubmit={handleSubmit}>
          {error ? <ErrorBanner message={error} /> : null}
          <Field label="Title">
            <input className="input" required minLength={3} maxLength={255} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" />
          </Field>
          <Field label="Priority">
            <select className="input input-select" value={priority} onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Body" hint="Urgent announcements trigger a push notification to all students.">
            <textarea className="input" required minLength={1} rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write the announcement…" />
          </Field>
          <Field label="Expires at" hint="Leave empty for no expiry.">
            <input className="input" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </Field>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Publish announcement'}
            </button>
            <button className="btn" type="button" onClick={() => navigate('/announcements')}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}