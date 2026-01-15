import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../state/AuthContext';

interface PostItem {
  id: number;
  message: string;
  createdAt: string;
  userAlias: string;
  likesCount: number;
  userId: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const PostsPage: React.FC = () => {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingMessage, setEditingMessage] = useState('');

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

  const startEditingPost = (post: PostItem) => {
    if (!user) return;
    setEditingPostId(post.id);
    setEditingMessage(post.message);
  };

  const handleUpdatePost = async (postId: number) => {
    if (!token) return;
    if (!editingMessage.trim()) return;

    await axios.put(
      `${API_BASE}/posts/${postId}`,
      { message: editingMessage },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditingPostId(null);
    setEditingMessage('');
    await fetchPosts();
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingMessage('');
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
            {posts.map((post) => {
              const isOwner = user && post.userId === user.id;
              const isEditing = editingPostId === post.id;

              return (
                <li
                  key={post.id}
                  className={`card ${isOwner ? 'border border-emerald-500/70 bg-slate-900/60' : ''}`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-primary-500">
                      @{post.userAlias}
                      {isOwner && (
                        <span className="ml-1 text-xs text-emerald-400">(tú)</span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                      {isOwner && !isEditing && (
                        <button
                          type="button"
                          className="text-xs text-emerald-400 hover:underline"
                          onClick={() => startEditingPost(post)}
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <>
                      <textarea
                        className="input min-h-[80px] resize-none"
                        value={editingMessage}
                        onChange={(e) => setEditingMessage(e.target.value)}
                      />
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          className="button-primary px-3 py-1 text-xs"
                          onClick={() => handleUpdatePost(post.id)}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1 text-xs rounded border border-slate-600 hover:bg-slate-800"
                          onClick={handleCancelEdit}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
