import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-[#edf2ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141c31] border border-slate-800 rounded-3xl p-7 lg:p-8 space-y-6 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center mx-auto shadow-sm">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#edf2ff]">Welcome Back</h1>
          <p className="text-xs text-[#a9b5d0]">
            Sign in to access your private 21-Day PTE Academic Progress Tracker
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#edf2ff] mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                clearError();
                setEmail(e.target.value);
              }}
              placeholder="e.g. user@example.com"
              className="w-full bg-[#0e1729] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-[#edf2ff] placeholder-[#a9b5d0]/50 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#edf2ff] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                clearError();
                setPassword(e.target.value);
              }}
              placeholder="••••••••"
              className="w-full bg-[#0e1729] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-[#edf2ff] placeholder-[#a9b5d0]/50 focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-800">
          <p className="text-xs text-[#a9b5d0]">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-blue-400 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
