import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-[#0b1020] text-[#edf2ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141c31] border border-[#2b3856] rounded-3xl p-7 lg:p-8 space-y-6 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#edf2ff]">Start 21-Day Journey</h1>
          <p className="text-xs text-[#a9b5d0]">
            Create your private account to track 4,200 questions and 42 mock exams
          </p>
        </div>

        {displayError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{displayError}</span>
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
                setLocalError(null);
                setEmail(e.target.value);
              }}
              placeholder="e.g. user@example.com"
              className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-3.5 py-2.5 text-sm text-[#edf2ff] placeholder-[#a9b5d0]/50 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#edf2ff] mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              Password (Min. 6 chars)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                clearError();
                setLocalError(null);
                setPassword(e.target.value);
              }}
              placeholder="••••••••"
              className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-3.5 py-2.5 text-sm text-[#edf2ff] placeholder-[#a9b5d0]/50 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#edf2ff] mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => {
                clearError();
                setLocalError(null);
                setConfirmPassword(e.target.value);
              }}
              placeholder="••••••••"
              className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-3.5 py-2.5 text-sm text-[#edf2ff] placeholder-[#a9b5d0]/50 focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-[#2b3856]">
          <p className="text-xs text-[#a9b5d0]">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
