import type { ReactNode } from 'react';
import type { PaginationMeta } from '../types';

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="spinner-wrap">
      <span className="spinner" aria-hidden="true" />
      {label ? <p className="spinner-label">{label}</p> : null}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </div>
  );
}

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'accent';

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

const STATUS_TONES: Record<string, Tone> = {
  active: 'success',
  suspended: 'danger',
  deleted: 'muted',
  published: 'success',
  draft: 'muted',
  archived: 'info',
  expired: 'warning',
  visible: 'success',
  hidden: 'warning',
  pending: 'warning',
  reviewed: 'info',
  resolved: 'success',
  dismissed: 'muted',
};

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONES[status] ?? 'muted';
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <Badge tone={tone}>{label}</Badge>;
}

export function Pill({ children, tone = 'muted' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

export function Pagination({ meta, page, onPageChange }: { meta: PaginationMeta; page: number; onPageChange: (page: number) => void }) {
  if (!meta || meta.totalPages <= 1) return null;
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(meta.totalPages, page + 2);
  for (let i = start; i <= end; i += 1) pages.push(i);
  return (
    <div className="pagination">
      <button className="btn btn-ghost" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      {start > 1 ? <button className="btn btn-ghost" onClick={() => onPageChange(1)}>1</button> : null}
      {start > 2 ? <span className="pagination-ellipsis">…</span> : null}
      {pages.map((p) => (
        <button key={p} className={`btn ${p === page ? 'btn-primary' : 'btn-ghost'}`} onClick={() => onPageChange(p)}>
          {p}
        </button>
      ))}
      {end < meta.totalPages - 1 ? <span className="pagination-ellipsis">…</span> : null}
      {end < meta.totalPages ? (
        <button className="btn btn-ghost" onClick={() => onPageChange(meta.totalPages)}>
          {meta.totalPages}
        </button>
      ) : null}
      <button className="btn btn-ghost" disabled={page >= meta.totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
      <span className="pagination-info">
        Page {meta.page} of {meta.totalPages}
      </span>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="empty-state">{message}</div>;
}

export function ErrorBanner({ message }: { message: string }) {
  return <div className="banner banner-error">{message}</div>;
}

export function SuccessBanner({ message }: { message: string }) {
  return <div className="banner banner-success">{message}</div>;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function confirmAction(message: string): boolean {
  return window.confirm(message);
}