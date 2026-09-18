import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { AdminOverview } from '../types';
import { PageHeader, Spinner, ErrorBanner, StatusBadge, Pill, formatDate, truncate, EmptyState } from '../components/ui';

function fetchOverview(): Promise<AdminOverview> {
  return api.get('/admin/overview').then((res) => res.data.data as AdminOverview);
}

interface StatCard {
  label: string;
  value: number;
  to: string;
  tone: string;
}

const POST_CATEGORY_TONES: Record<string, 'info' | 'success' | 'warning' | 'accent'> = {
  news: 'accent',
  event: 'success',
  academic: 'info',
  general: 'warning',
};

const PRIORITY_TONES: Record<string, 'danger' | 'warning' | 'info' | 'muted'> = {
  urgent: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'muted',
};

export function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: fetchOverview,
  });

  const stats = data?.stats;
  const cards: StatCard[] = stats
    ? [
        { label: 'Active Users', value: stats.users, to: '/users', tone: 'blue' },
        { label: 'Published Posts', value: stats.posts, to: '/posts', tone: 'green' },
        { label: 'Comments', value: stats.comments, to: '/comments', tone: 'purple' },
        { label: 'Announcements', value: stats.announcements, to: '/announcements', tone: 'amber' },
        { label: 'Pending Reports', value: stats.pendingReports, to: '/reports', tone: 'red' },
        { label: 'Audit Events', value: stats.auditEvents, to: '/audit', tone: 'gray' },
      ]
    : [];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of the campus news system" />
      {isLoading ? <Spinner label="Loading dashboard…" /> : null}
      {isError ? <ErrorBanner message={(error as Error)?.message ?? 'Failed to load dashboard'} /> : null}
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

          <div className="overview-grid">
            <section className="card overview-card">
              <div className="overview-card-head">
                <h2>Recent posts</h2>
                <Link className="overview-link" to="/posts">
                  View all
                </Link>
              </div>
              {data.recentPosts.length === 0 ? <EmptyState message="No posts yet." /> : null}
              <ul className="overview-list">
                {data.recentPosts.map((post) => (
                  <li key={post.id}>
                    <div className="overview-item-main">
                      <Link to={`/posts/${post.id}/edit`} className="overview-title">
                        {post.title}
                      </Link>
                      <span className="cell-secondary">
                        by {post.authorName} · {post.likeCount} likes · {post.commentCount} comments
                      </span>
                    </div>
                    <div className="overview-item-meta">
                      <Pill tone={POST_CATEGORY_TONES[post.category] ?? 'muted'}>{post.category}</Pill>
                      <StatusBadge status={post.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card overview-card">
              <div className="overview-card-head">
                <h2>Pending reports</h2>
                <Link className="overview-link" to="/reports">
                  Review queue
                </Link>
              </div>
              {data.pendingReports.length === 0 ? <EmptyState message="No pending reports. All clear." /> : null}
              <ul className="overview-list">
                {data.pendingReports.map((report) => (
                  <li key={report.id}>
                    <div className="overview-item-main">
                      <span className="overview-title">{truncate(report.reason, 70)}</span>
                      <span className="cell-secondary">
                        <Pill>{report.targetType}</Pill> reported by {report.reporterName}
                      </span>
                    </div>
                    <span className="cell-secondary">{formatDate(report.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card overview-card">
              <div className="overview-card-head">
                <h2>Recent announcements</h2>
                <Link className="overview-link" to="/announcements">
                  Manage
                </Link>
              </div>
              {data.recentAnnouncements.length === 0 ? <EmptyState message="No announcements yet." /> : null}
              <ul className="overview-list">
                {data.recentAnnouncements.map((ann) => (
                  <li key={ann.id}>
                    <div className="overview-item-main">
                      <span className="overview-title">{truncate(ann.title, 60)}</span>
                      <span className="cell-secondary">{formatDate(ann.publishedAt)}</span>
                    </div>
                    <div className="overview-item-meta">
                      <Pill tone={PRIORITY_TONES[ann.priority] ?? 'muted'}>{ann.priority}</Pill>
                      <StatusBadge status={ann.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card overview-card">
              <div className="overview-card-head">
                <h2>Recent comments</h2>
                <Link className="overview-link" to="/comments">
                  Moderate
                </Link>
              </div>
              {data.recentComments.length === 0 ? <EmptyState message="No comments yet." /> : null}
              <ul className="overview-list">
                {data.recentComments.map((comment) => (
                  <li key={comment.id}>
                    <div className="overview-item-main">
                      <span className="overview-title">{truncate(comment.body.replace(/\s+/g, ' '), 80)}</span>
                      <span className="cell-secondary">
                        {comment.authorName} on “{truncate(comment.postTitle, 40)}”
                      </span>
                    </div>
                    <div className="overview-item-meta">
                      <StatusBadge status={comment.status} />
                      <span className="cell-secondary">{formatDate(comment.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="card overview-card">
            <div className="overview-card-head">
              <h2>Recent admin activity</h2>
              <Link className="overview-link" to="/audit">
                Full audit log
              </Link>
            </div>
            {data.recentAudit.length === 0 ? <EmptyState message="No admin activity recorded yet." /> : null}
            <ul className="overview-list">
              {data.recentAudit.map((entry) => (
                <li key={entry.id}>
                  <div className="overview-item-main">
                    <span className="overview-title">{entry.action}</span>
                    <span className="cell-secondary">
                      {entry.actorEmail ?? 'system'}
                      {entry.targetType ? ` · ${entry.targetType}` : ''}
                    </span>
                  </div>
                  <span className="cell-secondary">{formatDate(entry.createdAt)}</span>
                </li>
              ))}
            </ul>
          </section>

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