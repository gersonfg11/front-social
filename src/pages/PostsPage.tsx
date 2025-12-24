import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../state/AuthContext';

interface PostItem {
  id: number;
  message: string;
  createdAt: string;
  userAlias: string;
  likesCount: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const PostsPage: React.FC = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get<PostItem[]>(`${API_BASE}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !token) return;
    setSubmitting(true);
    try {
      await axios.post(
        `${API_BASE}/posts`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('');
      await fetchPosts();
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: number) => {
    if (!token) return;
    await axios.post(
      `${API_BASE}/posts/${postId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchPosts();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <section className="card">
        <h2 className="mb-3 text-lg font-semibold">Crear publicación</h2>
        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            className="input min-h-[80px] resize-none"
            placeholder="¿Qué estás pensando?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Publicando…' : 'Publicar'}
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Publicaciones</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Cargando publicaciones…</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-slate-400">No hay publicaciones aún.</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.id} className="card">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-500">@{post.userAlias}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mb-3 text-sm">{post.message}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <button
                    type="button"
                    className="button-primary px-3 py-1 text-xs"
                    onClick={() => handleLike(post.id)}
                  >
                    Like
                  </button>
                  <span>{post.likesCount} like(s)</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
