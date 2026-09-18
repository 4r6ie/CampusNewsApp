import { useState } from 'react';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api, getErrorMessage } from '../lib/api';
import type { AdminReport, ListResult, ReportStatus } from '../types';
import { PageHeader, StatusBadge, Pill, Pagination, Spinner, EmptyState, ErrorBanner, formatDate, truncate } from '../components/ui';

const limit = 20;

export function ReportsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const { data, isFetching, isError } = useQuery<ListResult<AdminReport>>({
    queryKey: ['admin', 'reports', page, status],
    queryFn: async () => {
      const { data: res } = await api.get('/admin/reports', {
        params: { page, limit, status: status || undefined },
      });
      return { rows: res.data as AdminReport[], meta: res.meta };
    },
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: ReportStatus }) =>
      api.patch(`/admin/reports/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
    onError: (err: unknown) => setError(getErrorMessage(err)),
  });

  const changeStatus = (report: AdminReport, newStatus: ReportStatus) => {
    mutation.mutate({ id: report.id, newStatus });
  };

  return (
    <div>
      <PageHeader title="Reports" subtitle="Review and resolve content reports" />
      <div className="filter-bar">
        <select className="input input-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>
      {error ? <ErrorBanner message={error} /> : null}
      {isError ? <ErrorBanner message="Failed to load reports" /> : null}
      {isFetching && !data ? <Spinner label="Loading reports…" /> : null}
      {data && data.rows.length === 0 ? <EmptyState message="No reports match." /> : null}
      {data && data.rows.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Target</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Reported</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="cell-primary">{report.reporterName}</div>
                    <div className="cell-secondary">{report.reporterEmail}</div>
                  </td>
                  <td>
                    <Pill>{report.targetType}</Pill>
                    <div className="cell-secondary">{truncate(report.targetId, 20)}</div>
                  </td>
                  <td>
                    <div className="cell-secondary">{truncate(report.reason, 120)}</div>
                  </td>
                  <td>
                    <StatusBadge status={report.status} />
                  </td>
                  <td>{formatDate(report.createdAt)}</td>
                  <td className="td-actions">
                    {report.status === 'pending' ? (
                      <>
                        <button className="btn btn-sm" type="button" disabled={mutation.isPending} onClick={() => changeStatus(report, 'reviewed')}>
                          Review
                        </button>
                        <button className="btn btn-sm" type="button" disabled={mutation.isPending} onClick={() => changeStatus(report, 'resolved')}>
                          Resolve
                        </button>
                        <button className="btn btn-sm btn-ghost" type="button" disabled={mutation.isPending} onClick={() => changeStatus(report, 'dismissed')}>
                          Dismiss
                        </button>
                      </>
                    ) : report.status === 'reviewed' ? (
                      <button className="btn btn-sm" type="button" disabled={mutation.isPending} onClick={() => changeStatus(report, 'resolved')}>
                        Resolve
                      </button>
                    ) : null}
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