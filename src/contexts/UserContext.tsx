
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  nickname: string;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  hasProfile: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('gameup-user');
    if (savedUser) {
      setUserState(JSON.parse(savedUser));
    }
  }, []);

  const setUser = (userData: User) => {
    setUserState(userData);
    localStorage.setItem('gameup-user', JSON.stringify(userData));
  };

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem('gameup-user');
  };

  const hasProfile = user !== null && user.nickname.trim() !== '';

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, hasProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
