import { useState } from 'react';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api, getErrorMessage } from '../lib/api';
import type { AdminUser, ListResult, UserStatus } from '../types';
import { PageHeader, StatusBadge, Pill, Pagination, Spinner, EmptyState, ErrorBanner, formatDate, confirmAction } from '../components/ui';

const limit = 20;

interface FilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
}

export function FilterBar({ search, setSearch, status, setStatus }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <input
        className="input"
        placeholder="Search…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select className="input input-select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="deleted">Deleted</option>
      </select>
    </div>
  );
}

export function UsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const { data, isFetching, isError } = useQuery<ListResult<AdminUser>>({
    queryKey: ['admin', 'users', page, search, status],
    queryFn: async () => {
      const { data: res } = await api.get('/admin/users', {
        params: { page, limit, search: search || undefined, status: status || undefined },
      });
      return { rows: res.data as AdminUser[], meta: res.meta };
    },
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: UserStatus }) =>
      api.patch(`/admin/users/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (err: unknown) => setError(getErrorMessage(err)),
  });

  const changeStatus = (user: AdminUser, newStatus: UserStatus) => {
    if (newStatus === 'deleted' && !confirmAction(`Delete user ${user.email}? This cannot be undone.`)) return;
    mutation.mutate({ id: user.id, newStatus });
  };

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage student and staff accounts"
        actions={<span className="page-count">{data?.meta.total ?? '—'} users</span>}
      />
      <FilterBar search={search} setSearch={setSearch} status={status} setStatus={setStatus} />
      {error ? <ErrorBanner message={error} /> : null}
      {isError ? <ErrorBanner message="Failed to load users" /> : null}
      {isFetching && !data ? <Spinner label="Loading users…" /> : null}
      {data && data.rows.length === 0 ? <EmptyState message="No users match." /> : null}
      {data && data.rows.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="cell-primary">{user.fullName ?? '—'}</div>
                    {user.studentNo ? <div className="cell-secondary">{user.studentNo}</div> : null}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <Pill>{user.role}</Pill>
                  </td>
                  <td>
                    <StatusBadge status={user.status} />
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td className="td-actions">
                    {user.status !== 'deleted' ? (
                      <>
                        {user.status === 'active' ? (
                          <button className="btn btn-sm" type="button" disabled={mutation.isPending} onClick={() => changeStatus(user, 'suspended')}>
                            Suspend
                          </button>
                        ) : (
                          <button className="btn btn-sm" type="button" disabled={mutation.isPending} onClick={() => changeStatus(user, 'active')}>
                            Activate
                          </button>
                        )}
                        <button className="btn btn-sm btn-danger" type="button" disabled={mutation.isPending} onClick={() => changeStatus(user, 'deleted')}>
                          Delete
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-sm" type="button" disabled={mutation.isPending} onClick={() => changeStatus(user, 'active')}>
                        Restore
                      </button>
                    )}
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