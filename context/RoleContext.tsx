'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'admin' | 'secretary' | 'voiceLeader';
type VoiceSection = 'Soprano' | 'Alto' | 'Tenor' | 'Bass' | null;

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  voiceSection: VoiceSection;
  setVoiceSection: (voice: VoiceSection) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('admin');
  const [voiceSection, setVoiceSection] = useState<VoiceSection>(null);
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