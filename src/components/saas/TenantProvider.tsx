import React, { createContext, useContext, useMemo } from 'react';
import { resolveTenant } from '@/lib/tenant';

interface TenantInfo {
  slug: string;
  type: 'subdomain' | 'path' | 'none';
}

const TenantContext = createContext<TenantInfo>({ slug: 'default', type: 'none' });

export const useTenant = () => useContext(TenantContext);

const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const tenant = useMemo(() => resolveTenant(), []);

  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  );
};

export default TenantProvider;
