import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-[#edf2ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141c31] border border-slate-800 rounded-3xl p-7 lg:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center mx-auto shadow-sm">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#edf2ff]">Reset Password</h1>
          <p className="text-xs text-[#a9b5d0]">
            Enter your email to receive a password reset link
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-3 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
            <p className="font-semibold">Reset email sent!</p>
            <p className="text-[11px] text-[#a9b5d0]">
              Check your inbox at <b>{email}</b> for instructions to reset your password.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-blue-400 font-semibold hover:underline mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="pt-2 text-center border-t border-slate-800">
          <Link to="/login" className="text-xs text-[#a9b5d0] hover:text-[#edf2ff] flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
