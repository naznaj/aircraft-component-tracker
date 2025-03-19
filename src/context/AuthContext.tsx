
import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  isAuthorized: (authorizedRoles: UserRole[]) => boolean;
}

const initialUser: User = {
  id: '1',
  name: 'John Smith',
  role: 'CAMO Planning',
  department: 'CAMO-Planning'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);

  const switchRole = (role: UserRole) => {
    if (!currentUser) return;
    
    setCurrentUser({
      ...currentUser,
      role,
      department: role.replace(' ', '-')
    });
  };

  const isAuthorized = (authorizedRoles: UserRole[]) => {
    if (!currentUser) return false;
    return authorizedRoles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, switchRole, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
