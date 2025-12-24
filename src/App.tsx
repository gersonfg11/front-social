import React from 'react';
import { Navigate, Route, Routes, Link } from 'react-router-dom';
import { useAuth } from './state/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { PostsPage } from './pages/PostsPage';

const App: React.FC = () => {
  const { token, logout, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to={token ? '/posts' : '/login'} className="text-lg font-semibold text-primary-500">
            Periferia Social
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {token && (
              <>
                <Link to="/posts" className="hover:text-primary-500">
                  Publicaciones
                </Link>
                <Link to="/profile" className="hover:text-primary-500">
                  Perfil
                </Link>
                <span className="hidden sm:inline text-slate-400">{user?.alias}</span>
                <button className="text-xs text-slate-400 hover:text-red-400" onClick={logout}>
                  Cerrar sesión
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/posts" replace /> : <LoginPage />} />
          <Route
            path="/profile"
            element={token ? <ProfilePage /> : <Navigate to="/login" replace />}
          />
          <Route path="/posts" element={token ? <PostsPage /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to={token ? '/posts' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
