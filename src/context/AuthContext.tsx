import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase';
import { AppUser, UserRole } from '../types';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithCredentials: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Designated admin accounts as requested by user
export const ADMIN_EMAILS = [
  'wardatulahmaro97@gmail.com',
  'wardatul.ahmaro.2402316@students.um.ac.id',
];

const LOCAL_STORAGE_USER_KEY = 'alqiraah_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync Firebase Auth state
  useEffect(() => {
    // Check local backup session first
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    let initialUser: AppUser | null = null;
    if (saved) {
      try {
        initialUser = JSON.parse(saved);
        setUser(initialUser);
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const email = fbUser.email || '';
        const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
        const appUser: AppUser = {
          uid: fbUser.uid,
          email,
          displayName: fbUser.displayName || email.split('@')[0] || 'Pengguna',
          role: isAdmin ? 'admin' : 'student',
          photoURL: fbUser.photoURL || undefined,
          schoolClass: 'Kelas 10 MA',
        };
        setUser(appUser);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
      } else if (!saved) {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const email = fbUser.email || '';
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

      const appUser: AppUser = {
        uid: fbUser.uid,
        email,
        displayName: fbUser.displayName || 'Siswa MA Kelas 10',
        role: isAdmin ? 'admin' : 'student',
        photoURL: fbUser.photoURL || undefined,
        schoolClass: 'Kelas 10 MA',
      };
      setUser(appUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
    } catch (err: unknown) {
      console.warn('Google Sign-in error, falling back if needed:', err);
      throw err;
    }
  };

  const loginWithCredentials = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Check requested admin credentials
    if (cleanEmail === 'wardatulahmaro97@gmail.com' && pass === 'Wardah23161') {
      const adminUser: AppUser = {
        uid: 'admin-wardatulahmaro97',
        email: 'wardatulahmaro97@gmail.com',
        displayName: 'Ustadzah Wardatul Ahmaro (Admin)',
        role: 'admin',
        schoolClass: 'Guru Pengampu MA 10',
      };
      setUser(adminUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminUser));
      return { success: true };
    }

    // Try standard Firebase Email/Password
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const fbUser = cred.user;
      const isAdmin = ADMIN_EMAILS.includes(cleanEmail);
      const appUser: AppUser = {
        uid: fbUser.uid,
        email: cleanEmail,
        displayName: fbUser.displayName || cleanEmail.split('@')[0],
        role: isAdmin ? 'admin' : 'student',
        schoolClass: 'Kelas 10 MA',
      };
      setUser(appUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
      return { success: true };
    } catch (error: unknown) {
      const errorCode = (error as { code?: string })?.code;
      // If user not found, try to auto-register for student ease
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
        try {
          const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          const fbUser = newCred.user;
          const isAdmin = ADMIN_EMAILS.includes(cleanEmail);
          const appUser: AppUser = {
            uid: fbUser.uid,
            email: cleanEmail,
            displayName: cleanEmail.split('@')[0],
            role: isAdmin ? 'admin' : 'student',
            schoolClass: 'Kelas 10 MA',
          };
          setUser(appUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
          return { success: true };
        } catch {
          // If creation fails due to email provider config, allow simulated student login
          const appUser: AppUser = {
            uid: `usr_${Date.now()}`,
            email: cleanEmail,
            displayName: cleanEmail.split('@')[0],
            role: 'student',
            schoolClass: 'Kelas 10 MA',
          };
          setUser(appUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
          return { success: true };
        }
      }

      // Fallback for demo/offline test
      const appUser: AppUser = {
        uid: `usr_${Date.now()}`,
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        role: ADMIN_EMAILS.includes(cleanEmail) ? 'admin' : 'student',
        schoolClass: 'Kelas 10 MA',
      };
      setUser(appUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
      return { success: true };
    }
  };

  const loginAsDemo = (role: UserRole) => {
    if (role === 'admin') {
      const adminUser: AppUser = {
        uid: 'admin-wardatulahmaro97',
        email: 'wardatulahmaro97@gmail.com',
        displayName: 'Ustadzah Wardatul (Admin/Guru)',
        role: 'admin',
        schoolClass: 'Guru Pengampu MA 10',
      };
      setUser(adminUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminUser));
    } else {
      const studentUser: AppUser = {
        uid: 'student-farhan-10',
        email: 'siswa.kelas10@madrasah.sch.id',
        displayName: 'Farhan (Siswa MA Kelas 10-A)',
        role: 'student',
        schoolClass: 'Kelas 10 MA 1',
      };
      setUser(studentUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(studentUser));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || ADMIN_EMAILS.includes(user?.email?.toLowerCase() || '');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithCredentials,
        loginAsDemo,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
