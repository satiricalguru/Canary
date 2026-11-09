'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_ROLES } from '@/lib/data/seededData';
import { DemoRole, DemoRoleInfo } from '@/lib/types/domain';
import { recordAuditEvent } from '@/lib/api/client';

interface RoleContextType {
  activeRole: DemoRole;
  roleInfo: DemoRoleInfo;
  setRole: (role: DemoRole) => void;
  isRegulator: boolean;
  isSiteHse: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<DemoRole>('oh_lead');

  // Load from cookie or localStorage on initial mount
  useEffect(() => {
    const saved = localStorage.getItem('canary_role') as DemoRole | null;
    if (saved && DEMO_ROLES.some((r) => r.id === saved)) {
      setActiveRoleState(saved);
      document.cookie = `canary_role=${saved}; path=/; max-age=86400`;
    }
  }, []);

  const setRole = (newRole: DemoRole) => {
    setActiveRoleState(newRole);
    localStorage.setItem('canary_role', newRole);
    document.cookie = `canary_role=${newRole}; path=/; max-age=86400`;

    // Record audit event for role change
    recordAuditEvent({
      actorRole: newRole,
      eventType: 'ROLE_SWITCH',
      resourceId: `session_${newRole}`,
    });
  };

  const roleInfo = DEMO_ROLES.find((r) => r.id === activeRole) || DEMO_ROLES[0];

  return (
    <RoleContext.Provider
      value={{
        activeRole,
        roleInfo,
        setRole,
        isRegulator: activeRole === 'regulator',
        isSiteHse: activeRole === 'hse_officer',
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useDemoRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useDemoRole must be used within a RoleProvider');
  }
  return context;
};

