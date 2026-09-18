import { useState } from 'react';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api, getErrorMessage } from '../lib/api';
import type { AdminAnnouncement, AnnouncementStatus, ListResult } from '../types';
import { PageHeader, StatusBadge, Pill, Pagination, Spinner, EmptyState, ErrorBanner, formatDate, truncate, confirmAction } from '../components/ui';

const limit = 20;

const PRIORITY_TONES: Record<string, 'danger' | 'warning' | 'info' | 'muted'> = {
  urgent: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'muted',
};

export function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const { data, isFetching, isError } = useQuery<ListResult<AdminAnnouncement>>({
    queryKey: ['admin', 'announcements', page, status],
    queryFn: async () => {
      const { data: res } = await api.get('/admin/announcements', {
        params: { page, limit, status: status || undefined },
      });
      return { rows: res.data as AdminAnnouncement[], meta: res.meta };
    },
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: AnnouncementStatus }) =>
      api.patch(`/admin/announcements/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] });
    },
    onError: (err: unknown) => setError(getErrorMessage(err)),
  });

  const changeStatus = (item: AdminAnnouncement, newStatus: AnnouncementStatus) => {
    if (newStatus === 'deleted' && !confirmAction(`Delete announcement "${truncate(item.title, 40)}"? This cannot be undone.`)) return;
    mutation.mutate({ id: item.id, newStatus });
  };

  return (
    <div>
      <PageHeader
        title="Announcements"
        subtitle="Publish and manage announcements"
        actions={
          <Link className="btn btn-primary" to="/announcements/new">
            New announcement
          </Link>
        }
      />
      <div className="filter-bar">
        <select className="input input-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="expired">Expired</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>
      {error ? <ErrorBanner message={error} /> : null}
      {isError ? <ErrorBanner message="Failed to load announcements" /> : null}
      {isFetching && !data ? <Spinner label="Loading announcements…" /> : null}
      {data && data.rows.length === 0 ? <EmptyState message="No announcements match." /> : null}
      {data && data.rows.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Publishes</th>
                <th>Expires</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="cell-primary">{truncate(item.title, 70)}</div>
                    <div className="cell-secondary">{truncate(item.body.replace(/\s+/g, ' '), 80)}</div>
                  </td>
                  <td>
                    <Pill tone={PRIORITY_TONES[item.priority] ?? 'muted'}>{item.priority}</Pill>
                  </td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td>{formatDate(item.publishedAt)}</td>
                  <td>{formatDate(item.expiresAt)}</td>
                  <td className="td-actions">
                    <Link className="btn btn-sm" to={`/announcements/${item.id}/edit`}>
                      Edit
                    </Link>
                    {item.status !== 'published' ? (
                      <button className="btn btn-sm" type="button" disabled={mutation.isPending} onClick={() => changeStatus(item, 'published')}>
                        Publish
                      </button>
                    ) : (
                      <button className="btn btn-sm" type="button" disabled={mutation.isPending} onClick={() => changeStatus(item, 'expired')}>
                        Expire
                      </button>
                    )}
                    <button className="btn btn-sm btn-danger" type="button" disabled={mutation.isPending} onClick={() => changeStatus(item, 'deleted')}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {data ? <Pagination meta={data.meta} page={page} onPageChange={setPage} /> : null}
    </div>
  );
}