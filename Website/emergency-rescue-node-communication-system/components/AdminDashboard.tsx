import React, { useEffect, useState } from 'react';
import { getAdminStats, getAdminUsers } from '../services/backendService';
import type { AdminStatsResponse, UserRecord } from '../types/api';

interface AdminDashboardProps {
  token: string;
  adminEmail: string;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, adminEmail, onLogout }) => {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError('');
        const [statsResponse, usersResponse] = await Promise.all([
          getAdminStats(token),
          getAdminUsers(token),
        ]);
        setStats(statsResponse);
        setUsers(usersResponse.users);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load admin analytics.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [token]);

  return (
    <div className="relative min-h-screen w-full flex flex-col animate-fade-in">
      <header className="fixed top-4 left-0 right-0 z-50 px-4 animate-fade-in-down">
        <div className="max-w-6xl mx-auto px-4 py-3 bg-black/40 backdrop-blur-2xl border border-red-500/30 shadow-2xl rounded-xl flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">
              ADMIN EMERGENCY ANALYTICS
            </h1>
            <p className="text-xs text-slate-300">Signed in as {adminEmail}</p>
          </div>
          <button onClick={onLogout} className="px-4 py-2 text-sm font-semibold text-white bg-slate-700 rounded-md hover:bg-slate-600 transition-all duration-300">
            Logout
          </button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 pt-32">
        {isLoading && <p className="text-slate-200">Loading admin dashboard...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!isLoading && !error && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-black/30 backdrop-blur-xl rounded-xl border border-red-500/30">
                <p className="text-xs text-slate-300">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats?.total_users ?? 0}</p>
              </div>
              <div className="p-5 bg-black/30 backdrop-blur-xl rounded-xl border border-red-500/30">
                <p className="text-xs text-slate-300">With Emergency Number</p>
                <p className="text-3xl font-bold text-amber-300">{stats?.users_with_emergency_number ?? 0}</p>
              </div>
              <div className="p-5 bg-black/30 backdrop-blur-xl rounded-xl border border-red-500/30">
                <p className="text-xs text-slate-300">Without Emergency Number</p>
                <p className="text-3xl font-bold text-red-300">{stats?.users_without_emergency_number ?? 0}</p>
              </div>
            </section>
            <section className="p-5 bg-black/30 backdrop-blur-xl rounded-xl border border-red-500/30 overflow-x-auto">
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400 mb-4">
                User Session Records
              </h2>
              <table className="min-w-full text-sm text-left text-slate-200">
                <thead className="text-xs uppercase text-slate-300 border-b border-red-500/30">
                  <tr>
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Emergency Number</th>
                    <th className="py-3 pr-4">Location</th>
                    <th className="py-3 pr-4">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-red-500/10 hover:bg-black/20">
                      <td className="py-3 pr-4 font-medium text-white">{user.name}</td>
                      <td className="py-3 pr-4">{user.emergency_number || 'N/A'}</td>
                      <td className="py-3 pr-4">
                        {user.latitude && user.longitude ? (
                          <a href={"https://www.google.com/maps?q=" + user.latitude + "," + user.longitude} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">
                            📍 View on Map
                          </a>
                        ) : (
                          <span className="text-slate-500">N/A</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">{new Date(user.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;