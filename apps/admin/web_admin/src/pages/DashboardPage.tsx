import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { AdminStats } from '../types';
import { PageHeader, Spinner, ErrorBanner } from '../components/ui';

function fetchStats(): Promise<AdminStats> {
  return api.get('/admin/stats').then((res) => res.data.data as AdminStats);
}

interface StatCard {
  label: string;
  value: number;
  to: string;
  tone: string;
}

export function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchStats,
  });

  const cards: StatCard[] = data
    ? [
        { label: 'Active Users', value: data.users, to: '/users', tone: 'blue' },
        { label: 'Published Posts', value: data.posts, to: '/posts', tone: 'green' },
        { label: 'Comments', value: data.comments, to: '/comments', tone: 'purple' },
        { label: 'Announcements', value: data.announcements, to: '/announcements', tone: 'amber' },
        { label: 'Pending Reports', value: data.pendingReports, to: '/reports', tone: 'red' },
        { label: 'Audit Events', value: data.auditEvents, to: '/audit', tone: 'gray' },
      ]
    : [];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of the campus news system" />
      {isLoading ? <Spinner label="Loading stats…" /> : null}
      {isError ? <ErrorBanner message={(error as Error)?.message ?? 'Failed to load stats'} /> : null}
      {data ? (
        <>
          <div className="stat-grid">
            {cards.map((card) => (
              <Link key={card.label} to={card.to} className="stat-card">
                <span className={`stat-value stat-${card.tone}`}>{card.value}</span>
                <span className="stat-label">{card.label}</span>
              </Link>
            ))}
          </div>
          <div className="dashboard-actions">
            <h2>Quick actions</h2>
            <div className="quick-actions">
              <Link className="btn btn-primary" to="/posts/new">
                Publish a post
              </Link>
              <Link className="btn" to="/announcements/new">
                Create announcement
              </Link>
              <Link className="btn" to="/reports">
                Review reports
              </Link>
              <Link className="btn" to="/users">
                Manage users
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}