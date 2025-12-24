import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../state/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ProfilePage: React.FC = () => {
  const { user, token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('La nueva contraseña y la confirmación no coinciden');
      return;
    }

    if (!token) {
      setError('No hay sesión activa');
      return;
    }

    try {
      setSaving(true);
      await axios.post(
        `${API_BASE}/auth/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setError('No se pudo actualizar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-slate-400">Cargando perfil…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="card space-y-6">
        <h1 className="text-xl font-semibold">Perfil 👤</h1>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-slate-500">😀 Nombres</dt>
            <dd className="text-sm">{user.firstName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">👤 Apellidos</dt>
            <dd className="text-sm">{user.lastName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">🏷️ Alias</dt>
            <dd className="text-sm">{user.alias}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">🎂 Fecha de nacimiento</dt>
            <dd className="text-sm">{new Date(user.birthDate).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">📧 Email</dt>
            <dd className="text-sm">{user.email}</dd>
          </div>
        </dl>

        <div className="border-t border-slate-800 pt-4">
          <h2 className="mb-3 text-lg font-semibold">Cambiar contraseña 🔒</h2>
          <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
            <div>
              <label className="mb-1 block text-sm">Contraseña actual</label>
              <input
                type="password"
                className="input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Nueva contraseña</label>
              <input
                type="password"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Confirmar nueva contraseña</label>
              <input
                type="password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-emerald-400">{success}</p>}
            <button type="submit" className="button-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
