'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Role = 'admin' | 'secretary' | 'voiceLeader';
type VoiceSection = 'Soprano' | 'Alto' | 'Tenor' | 'Bass' | null;

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  voiceSection: VoiceSection;
  setVoiceSection: (voice: VoiceSection) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const mapRole = (backendRole: string): Role => {
  if (backendRole === 'Admin') return 'admin';
  if (backendRole === 'Secretary') return 'secretary';
  if (backendRole === 'Voice Leader' || backendRole === 'VoiceLeader') return 'voiceLeader';
  return 'admin';
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [role, setRole] = useState<Role>('admin');
  const [voiceSection, setVoiceSection] = useState<VoiceSection>(null);

  useEffect(() => {
    if (user) {
      setRole(mapRole(user.role));
      setVoiceSection((user.voice as VoiceSection) || null);
    }
  }, [user]);

  return (
    <RoleContext.Provider value={{ role, setRole, voiceSection, setVoiceSection }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within RoleProvider');
  return context;
};