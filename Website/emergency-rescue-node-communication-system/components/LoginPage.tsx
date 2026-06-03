import React, { useState } from 'react';
import PhoneIcon from './icons/PhoneIcon';

interface LoginPageProps {
  onLogin: (name: string, emergencyNumber: string) => Promise<void>;
  onAdminAccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onAdminAccess }) => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    try {
      setIsLoading(true);
      await onLogin(name.trim(), contactNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/40 backdrop-blur-xl rounded-xl shadow-2xl ring-1 ring-red-500/30 border border-red-500/30 animate-fade-in-up">
        <div className="text-center">
          <div className="mx-auto bg-gradient-to-r from-red-600 to-amber-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <PhoneIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400 text-shadow-amber animate-pulse-slow">
            EMERGENCY RESCUE NODE COMMUNICATION SYSTEM
          </h1>
          <p className="mt-2 text-slate-300 animate-fade-in">
            Sign in to access emergency services and nodes.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="animate-fade-in-up delay-100">
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
              Full Name
            </label>
            <div className="mt-1 relative">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                className="block w-full px-4 py-3 bg-black/30 border border-red-500/30 rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                placeholder="e.g., John Doe"
              />
            </div>
          </div>

          <div className="animate-fade-in-up delay-200">
            <label htmlFor="contactNumber" className="block text-sm font-medium text-slate-300">
              Emergency Contact Number
            </label>
            <div className="mt-1 relative">
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                autoComplete="tel"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value)
                  setError('')
                }}
                className="block w-full px-4 py-3 bg-black/30 border border-red-500/30 rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                placeholder="Optional, e.g., +1 234 567 8900"
              />
            </div>
          </div>

          {error && <p className="mt-2 text-xs text-red-400 animate-shake">{error}</p>}

          <div className="animate-fade-in-up delay-300">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 hover:shadow-red-500/30 active:scale-95"
            >
              {isLoading ? 'Securing Session...' : 'Access Emergency System'}
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={onAdminAccess}
          className="w-full text-center text-sm text-amber-300 hover:text-amber-200 transition-colors"
        >
          Admin Portal Access
        </button>
        
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>In case of emergency, dial your local emergency number immediately.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;