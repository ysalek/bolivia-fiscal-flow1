import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type FeatureItem = {
  id: string;
  icon: 'ShieldCheck' | 'ReceiptText' | 'BarChart3';
  title: string;
  description: string;
};

export interface SiteContent {
  brandName: string;
  productName: string;
  heroTitle: string;
  heroSubtitle: string;
  pricingUSD: number;
  pricingPeriod: string;
  pricingDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  features: FeatureItem[];
  footerLinks: { label: string; href: string }[];
  updatedAt?: string;
}

const DEFAULT_CONTENT: SiteContent = {
  brandName: 'Contabol',
  productName: 'Contabol SaaS',
  heroTitle: 'Sistema contable boliviano en la nube por $35/mes',
  heroSubtitle:
    'Facturación, libros, IVA (débito/crédito fiscal), reportes, POS y más. Cumple normativa y escala por empresa (multi-tenant).',
  pricingUSD: 35,
  pricingPeriod: '/mes',
  pricingDescription: 'Sin costos ocultos. Puedes crecer por empresa (subdominio o carpeta).',
  ctaPrimaryLabel: 'Comenzar gratis',
  ctaPrimaryHref: '/signup',
  ctaSecondaryLabel: 'Ver características',
  ctaSecondaryHref: '#caracteristicas',
  features: [
    {
      id: 'compliance',
      icon: 'ShieldCheck',
      title: 'Cumplimiento tributario',
      description: 'IVA, IT, libros diario/mayor, planes de cuentas y reportes exigidos.',
    },
    {
      id: 'billing-pos',
      icon: 'ReceiptText',
      title: 'Facturación y POS',
      description: 'Ventas al contado/crédito, comprobantes y control de inventario.',
    },
    {
      id: 'reports',
      icon: 'BarChart3',
      title: 'Reportes financieros',
      description: 'Balance general, resultados y flujo de efectivo con métricas clave.',
    },
  ],
  footerLinks: [
    { label: 'Características', href: '#caracteristicas' },
    { label: 'Suscripción', href: '/suscripcion' },
  ],
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY = 'site_content_v1';

interface SiteContentContextValue {
  content: SiteContent;
  setContent: (next: SiteContent) => void;
}

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined);

export const useSiteContent = () => {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent must be used within SiteContentProvider');
  return ctx;
};

export const SiteContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContentState] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SiteContent;
        setContentState({ ...DEFAULT_CONTENT, ...parsed });
      }
    } catch {}
  }, []);

  const setContent = useCallback((next: SiteContent) => {
    const value = { ...next, updatedAt: new Date().toISOString() };
    setContentState(value);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {}
  }, []);

  const value = useMemo(() => ({ content, setContent }), [content, setContent]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
};
