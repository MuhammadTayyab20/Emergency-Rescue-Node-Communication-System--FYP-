import React, { useState } from 'react';

interface AdminLoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onBackToUser: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, onBackToUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    try {
      setIsLoading(true);
      await onLogin(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log in as admin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/40 backdrop-blur-xl rounded-xl shadow-2xl ring-1 ring-red-500/30 border border-red-500/30 animate-fade-in-up">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400 text-shadow-amber">
            ADMIN CONTROL ACCESS
          </h1>
          <p className="mt-2 text-slate-300">Authorized emergency operations dashboard login.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-slate-300">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="mt-1 block w-full px-4 py-3 bg-black/30 border border-red-500/30 rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="admin@rescue.local"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="mt-1 block w-full px-4 py-3 bg-black/30 border border-red-500/30 rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter admin password"
            />
          </div>

          {error && <p className="text-xs text-red-400 animate-shake">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-amber-600 rounded-md hover:from-red-700 hover:to-amber-700 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In as Admin'}
          </button>
        </form>

        <button
          type="button"
          onClick={onBackToUser}
          className="w-full py-2 text-sm text-amber-300 hover:text-amber-200 transition-colors"
        >
          Back to User Access
        </button>
      </div>
    </div>
  );
};

export default AdminLoginPage;
