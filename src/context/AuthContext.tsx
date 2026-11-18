
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

import { Session } from '@supabase/supabase-js';

type UserRole = 'user' | 'doctor' | null;

type AuthContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;

  session: Session | null;
  setSession: (session: Session | null) => void;

  doctorId: string | null;
  setDoctorId: (id: string | null) => void;

  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [role, setRole] = useState<UserRole>(null);

  const [session, setSession] =
    useState<Session | null>(null);

  const [doctorId, setDoctorId] =
    useState<string | null>(null);

  const logout = () => {
    setSession(null);
    setRole(null);
    setDoctorId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        session,
        setSession,
        doctorId,
        setDoctorId,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuthContext must be used inside AuthProvider'
    );
  }

  return context;
}
