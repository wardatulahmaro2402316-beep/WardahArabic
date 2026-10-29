import React, { useState } from 'react';
import {
  BookOpen,
  Lock,
  Mail,
  KeyRound,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithCredentials, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Harap masukkan email dan kata sandi.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await loginWithCredentials(email, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Login gagal, periksa email dan kata sandi.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kendala saat login.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal login dengan Google.';
      setErrorMsg(`Google Sign-In: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('wardatulahmaro97@gmail.com');
    setPassword('Wardah23161');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* App Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-800 border-2 border-amber-400/60 shadow-xl flex items-center justify-center text-amber-300 mb-4 transform hover:scale-105 transition-transform">
          <BookOpen className="w-8 h-8 text-amber-300" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Al-Qira'ah MA Kelas 10
        </h2>
        <div className="font-['Amiri'] text-2xl text-amber-300 mt-1" dir="rtl">
          تَعْلِيْمُ مَهَارَةِ القِرَاءَةِ لِلصَّفِّ العَاشِرِ
        </div>
        <p className="mt-2 text-sm text-emerald-200">
          Portal Pembelajaran Bahasa Arab Interaktif Berbasis AI
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-emerald-700/50">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/80 border border-rose-600/70 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">
                Email / Username
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="wardatulahmaro97@gmail.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-emerald-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wardah23161"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-emerald-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm"
                  required
                />
              </div>
            </div>

            {/* Quick Fill Admin Button */}
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gunakan Akun Admin (wardatulahmaro97@gmail.com)</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Memproses Masuk...' : 'Masuk ke Aplikasi'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-emerald-400 font-medium">
                Atau masuk dengan
              </span>
            </div>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-emerald-700/80 bg-slate-800/80 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-sm hover:border-emerald-500"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Masuk via Akun Google</span>
          </button>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-5 border-t border-emerald-800/80">
            <p className="text-center text-xs text-emerald-300 mb-3 font-semibold">
              Mode Cepat (Demo Preview):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemo('admin')}
                className="py-2 px-3 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-amber-200 text-xs font-semibold border border-emerald-700/60 transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Masuk sbg Admin</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('student')}
                className="py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Masuk sbg Siswa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature summary */}
        <div className="mt-6 text-center text-xs text-emerald-300/80 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Teks Berharakat & Audio
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Ustadz AI Tutor
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Kuis & Evaluasi MA 10
          </span>
        </div>
      </div>
    </div>
  );
};
