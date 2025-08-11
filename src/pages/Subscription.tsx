import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSiteContent } from '@/components/cms/SiteContentProvider';
import { supabase } from "@/integrations/supabase/client";

const Subscription = () => {
  const { toast } = useToast();
  const { content } = useSiteContent();

  useEffect(() => {
    document.title = `Suscripción | ${content.productName}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', `Activa tu suscripción por $${content.pricingUSD}/${content.pricingPeriod.replace('/', '')} y accede al sistema contable.`);
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = window.location.href;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${content.productName} Suscripción`,
      description: `Acceso completo por $${content.pricingUSD}/${content.pricingPeriod.replace('/', '')}`,
      offers: {
        '@type': 'Offer',
        price: String(content.pricingUSD),
        priceCurrency: 'USD',
      },
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [content]);

const handleSubscribe = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout');
    if (error) throw error;
    if (data?.url) {
      window.open(data.url, '_blank');
    } else {
      throw new Error('No se recibió URL de checkout');
    }
  } catch (err: any) {
    toast({
      title: 'No se pudo iniciar el checkout',
      description: err.message || 'Inicia sesión y verifica la configuración de Stripe.',
      variant: 'destructive',
    });
  }
};

const handleManage = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    if (error) throw error;
    if (data?.url) window.open(data.url, '_blank');
  } catch (err: any) {
    toast({ title: 'No se pudo abrir el portal', description: err.message || 'Verifica tu suscripción y login.', variant: 'destructive' });
  }
};

const handleRefresh = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('check-subscription');
    if (error) throw error;
    toast({
      title: data?.subscribed ? 'Suscripción activa' : 'Sin suscripción',
      description: data?.subscription_tier ? `Plan: ${data.subscription_tier}` : undefined,
    });
  } catch (err: any) {
    toast({ title: 'No se pudo comprobar', description: err.message, variant: 'destructive' });
  }
};

return (
    <main className="p-6 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Plan Mensual</CardTitle>
          <CardDescription>$35 USD/mes — Acceso completo al sistema contable.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button onClick={handleSubscribe} className="flex-1">Suscribirme ahora</Button>
          <Button variant="outline" onClick={handleManage}>Gestionar suscripción</Button>
          <Button variant="ghost" onClick={handleRefresh}>Actualizar estado</Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default Subscription;
