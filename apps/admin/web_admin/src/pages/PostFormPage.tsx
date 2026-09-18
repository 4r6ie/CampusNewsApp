import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, getErrorMessage } from '../lib/api';
import type { AdminPost, PostCategory, PostPayload } from '../types';
import { PageHeader, Field, ErrorBanner, Spinner } from '../components/ui';

const CATEGORIES: PostCategory[] = ['news', 'event', 'academic', 'general'];

export function PostFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: existing, isFetching } = useQuery({
    queryKey: ['admin', 'post', id],
    queryFn: async (): Promise<AdminPost | null> => {
      if (!id) return null;
      const { data: res } = await api.get(`/posts/${id}`);
      return res.data as AdminPost;
    },
    enabled: isEdit,
  });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('general');
  const [body, setBody] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (existing && !loaded) {
    setTitle(existing.title);
    setCategory(existing.category);
    setBody(existing.body);
    setLoaded(true);
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload: PostPayload = { title, category, body };
      if (isEdit && id) {
        await api.patch(`/posts/${id}`, payload);
      } else {
        await api.post('/posts', payload);
      }
      navigate('/posts');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save post'));
      setSubmitting(false);
    }
  };

  return (
    <div className="page-narrow">
      <PageHeader title={isEdit ? 'Edit post' : 'New post'} subtitle={isEdit ? 'Update the post content' : 'Publish a new post to the campus feed'} />
      {isFetching ? <Spinner label="Loading post…" /> : null}
      {!isFetching && (
        <form className="card form-card" onSubmit={handleSubmit}>
          {error ? <ErrorBanner message={error} /> : null}
          <Field label="Title">
            <input className="input" required minLength={3} maxLength={255} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
          </Field>
          <Field label="Category">
            <select className="input input-select" value={category} onChange={(e) => setCategory(e.target.value as PostCategory)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Body" hint="Supports plain text. Content is shown on the mobile feed.">
            <textarea className="input" required minLength={1} rows={10} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write the post body…" />
          </Field>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Publish post'}
            </button>
            <button className="btn" type="button" onClick={() => navigate('/posts')}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}