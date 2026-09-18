import { useState } from 'react';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api, getErrorMessage } from '../lib/api';
import type { AdminComment, CommentStatus, ListResult } from '../types';
import { PageHeader, StatusBadge, Pagination, Spinner, EmptyState, ErrorBanner, formatDate, truncate, confirmAction } from '../components/ui';

const limit = 20;

export function CommentsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const { data, isFetching, isError } = useQuery<ListResult<AdminComment>>({
    queryKey: ['admin', 'comments', page, search, status],
    queryFn: async () => {
      const { data: res } = await api.get('/admin/comments', {
        params: { page, limit, search: search || undefined, status: status || undefined },
      });
      return { rows: res.data as AdminComment[], meta: res.meta };
    },
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: CommentStatus }) =>
      api.patch(`/admin/comments/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
    },
    onError: (err: unknown) => setError(getErrorMessage(err)),
  });

  const changeStatus = (comment: AdminComment, newStatus: CommentStatus) => {
    if (newStatus === 'deleted' && !confirmAction('Delete this comment? This cannot be undone.')) return;
    mutation.mutate({ id: comment.id, newStatus });
  };

  return (
    <div>
      <PageHeader title="Comments" subtitle="Moderate comments across all posts" />
      <div className="filter-bar">
        <input className="input" placeholder="Search comment, post, or author…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input input-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>
      {error ? <ErrorBanner message={error} /> : null}
      {isError ? <ErrorBanner message="Failed to load comments" /> : null}
      {isFetching && !data ? <Spinner label="Loading comments…" /> : null}
      {data && data.rows.length === 0 ? <EmptyState message="No comments match." /> : null}
      {data && data.rows.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Comment</th>
                <th>Post</th>
                <th>Author</th>
                <th>Status</th>
                <th>Created</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((comment) => (
                <tr key={comment.id}>
                  <td>
                    <div className="cell-secondary">{truncate(comment.body.replace(/\s+/g, ' '), 120)}</div>
                  </td>
                  <td>{truncate(comment.postTitle, 50)}</td>
                  <td>{comment.authorName}</td>
                  <td>
                    <StatusBadge status={comment.status} />
                  </td>
                  <td>{formatDate(comment.createdAt)}</td>
                  <td className="td-actions">
                    {comment.status === 'visible' ? (
                      <button className="btn btn-sm" type="button" disabled={mutation.isPending} onClick={() => changeStatus(comment, 'hidden')}>
                        Hide
                      </button>
                    ) : comment.status === 'hidden' ? (
                      <button className="btn btn-sm" type="button" disabled={mutation.isPending} onClick={() => changeStatus(comment, 'visible')}>
                        Restore
                      </button>
                    ) : null}
                    <button className="btn btn-sm btn-danger" type="button" disabled={mutation.isPending} onClick={() => changeStatus(comment, 'deleted')}>
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