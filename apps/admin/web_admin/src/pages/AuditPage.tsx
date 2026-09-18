import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { AdminAudit, ListResult } from '../types';
import { PageHeader, Pill, Pagination, Spinner, EmptyState, ErrorBanner, formatDate } from '../components/ui';

const limit = 30;

interface AuditEntry extends AdminAudit {
  parsedMetadata?: Record<string, unknown>;
}

export function AuditPage() {
  const [page, setPage] = useState(1);

  const { data, isFetching, isError } = useQuery<ListResult<AdminAudit>>({
    queryKey: ['admin', 'audit', page],
    queryFn: async () => {
      const { data: res } = await api.get('/admin/audit-logs', {
        params: { page, limit },
      });
      return { rows: res.data as AdminAudit[], meta: res.meta };
    },
    placeholderData: keepPreviousData,
  });

  const rows: AuditEntry[] =
    data?.rows.map((entry) => {
      let parsedMetadata: Record<string, unknown> | undefined;
      if (entry.metadataJson) {
        try {
          parsedMetadata = JSON.parse(entry.metadataJson) as Record<string, unknown>;
        } catch {
          parsedMetadata = undefined;
        }
      }
      return { ...entry, parsedMetadata };
    }) ?? [];

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Recorded administrative actions" />
      {isError ? <ErrorBanner message="Failed to load audit log" /> : null}
      {isFetching && !data ? <Spinner label="Loading audit log…" /> : null}
      {data && rows.length === 0 ? <EmptyState message="No audit events yet." /> : null}
      {data && rows.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Actor</th>
                <th>Target</th>
                <th>Details</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <Pill tone="info">{entry.action}</Pill>
                  </td>
                  <td>
                    <div className="cell-primary">{entry.actorEmail ?? 'system'}</div>
                  </td>
                  <td>
                    {entry.targetType ? (
                      <>
                        <div className="cell-primary">{entry.targetType}</div>
                        <div className="cell-secondary">{entry.targetId}</div>
                      </>
                    ) : (
                      <span className="cell-secondary">—</span>
                    )}
                  </td>
                  <td>
                    {entry.parsedMetadata && Object.keys(entry.parsedMetadata).length > 0 ? (
                      <span className="cell-secondary">{JSON.stringify(entry.parsedMetadata)}</span>
                    ) : (
                      <span className="cell-secondary">—</span>
                    )}
                  </td>
                  <td>{formatDate(entry.createdAt)}</td>
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