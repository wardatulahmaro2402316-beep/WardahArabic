import React from 'react';
import {
  BookOpen,
  Sparkles,
  BookmarkCheck,
  Settings,
  LogOut,
  UserCheck,
  GraduationCap,
  Languages,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: 'reading' | 'vocab' | 'analyzer' | 'admin';
  setActiveTab: (tab: 'reading' | 'vocab' | 'analyzer' | 'admin') => void;
  onOpenAiTutor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAiTutor }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('reading')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500/50 flex items-center justify-center text-emerald-200 shadow-inner">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  Al-Qira'ah <span className="text-amber-300 font-extrabold text-sm px-2 py-0.5 rounded bg-emerald-800/80 border border-emerald-700">MA 10</span>
                </h1>
                <span className="font-['Amiri'] text-amber-200 text-lg hidden sm:inline" dir="rtl">
                  مَهَارَةُ القِرَاءَةِ
                </span>
              </div>
              <p className="text-xs text-emerald-200 hidden md:block">
                Pendidikan Bahasa Arab Madrasah Aliyah Kelas 10
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('reading')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'reading'
                  ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Materi Qira'ah</span>
            </button>

            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'vocab'
                  ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">Kamus Mufradat</span>
            </button>

            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'analyzer'
                  ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Bedah Nahwu</span>
            </button>

            <button
              onClick={onOpenAiTutor}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>Tutor AI</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-amber-400 text-slate-900 font-bold shadow'
                    : 'bg-emerald-800/80 text-amber-200 border border-amber-400/40 hover:bg-emerald-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Admin Panel</span>
              </button>
            )}
          </nav>

          {/* User Profile & Logout Button */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-emerald-800">
            <div className="text-right hidden lg:block">
              <div className="text-xs font-semibold text-white flex items-center justify-end gap-1">
                {isAdmin ? (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-emerald-950 rounded text-[10px] font-bold">
                    ADMIN
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 bg-emerald-700 text-emerald-100 rounded text-[10px]">
                    SISWA
                  </span>
                )}
                {user?.displayName}
              </div>
              <div className="text-[11px] text-emerald-300 truncate max-w-[160px]">
                {user?.email}
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Keluar dari akun (Logout)"
              className="p-2 rounded-lg bg-emerald-800/80 hover:bg-rose-900/80 text-emerald-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium border border-emerald-700 hover:border-rose-700"
            >
              <LogOut className="w-4 h-4 text-rose-300" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
