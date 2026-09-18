import { useState } from 'react';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api, getErrorMessage } from '../lib/api';
import type { AdminPost, ListResult, PostStatus } from '../types';
import { PageHeader, StatusBadge, Pill, Pagination, Spinner, EmptyState, ErrorBanner, formatDate, truncate, confirmAction } from '../components/ui';

const limit = 20;

const POST_CATEGORY_TONES: Record<string, 'info' | 'success' | 'warning' | 'accent'> = {
  news: 'accent',
  event: 'success',
  academic: 'info',
  general: 'warning',
};

export function PostsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const { data, isFetching, isError } = useQuery<ListResult<AdminPost>>({
    queryKey: ['admin', 'posts', page, search, status],
    queryFn: async () => {
      const { data: res } = await api.get('/admin/posts', {
        params: { page, limit, search: search || undefined, status: status || undefined },
      });
      return { rows: res.data as AdminPost[], meta: res.meta };
    },
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: PostStatus }) =>
      api.patch(`/admin/posts/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
    },
    onError: (err: unknown) => setError(getErrorMessage(err)),
  });

  const changeStatus = (post: AdminPost, newStatus: PostStatus) => {
    if (newStatus === 'deleted' && !confirmAction(`Delete post "${truncate(post.title, 40)}"? This cannot be undone.`)) return;
    mutation.mutate({ id: post.id, newStatus });
  };

  return (
    <div>
      <PageHeader
        title="Posts"
        subtitle="Publish and moderate news content"
        actions={
          <Link className="btn btn-primary" to="/posts/new">
            New post
          </Link>
        }
      />
      <div className="filter-bar">
        <input className="input" placeholder="Search title or body…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input input-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>
      {error ? <ErrorBanner message={error} /> : null}
      {isError ? <ErrorBanner message="Failed to load posts" /> : null}
      {isFetching && !data ? <Spinner label="Loading posts…" /> : null}
      {data && data.rows.length === 0 ? <EmptyState message="No posts match." /> : null}
      {data && data.rows.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Likes</th>
                <th>Comments</th>
                <th>Updated</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="cell-primary">{truncate(post.title, 60)}</div>
                    <div className="cell-secondary">{truncate(post.body.replace(/\s+/g, ' '), 80)}</div>
                  </td>
                  <td>{post.authorName}</td>
                  <td>
                    <Pill tone={POST_CATEGORY_TONES[post.category] ?? 'muted'}>{post.category}</Pill>
                  </td>
                  <td>
                    <StatusBadge status={post.status} />
                  </td>
                  <td>{post.likeCount}</td>
                  <td>{post.commentCount}</td>
                  <td>{formatDate(post.updatedAt)}</td>
                  <td className="td-actions">
                    <Link className="btn btn-sm" to={`/posts/${post.id}/edit`}>
                      Edit
                    </Link>
                    {post.status !== 'published' ? (
                      <button className="btn btn-sm" type="button" disabled={mutation.isPending} onClick={() => changeStatus(post, 'published')}>
                        Publish
                      </button>
                    ) : (
                      <button className="btn btn-sm" type="button" disabled={mutation.isPending} onClick={() => changeStatus(post, 'archived')}>
                        Archive
                      </button>
                    )}
                    <button className="btn btn-sm btn-danger" type="button" disabled={mutation.isPending} onClick={() => changeStatus(post, 'deleted')}>
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