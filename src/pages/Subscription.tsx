import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSiteContent } from '@/components/cms/SiteContentProvider';

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

  const handleSubscribe = () => {
    // Placeholder: abrirá Stripe Checkout cuando esté configurado el edge function
    const url = localStorage.getItem('stripe_payment_link');
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: 'Configurar Stripe',
        description: 'Conecta tu clave secreta y crea el edge function create-checkout para abrir Stripe Checkout.',
      });
    }
  };

  const handleManage = () => {
    toast({
      title: 'Portal del cliente',
      description: 'Implementa el edge function customer-portal para gestionar la suscripción.',
    });
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
        </CardContent>
      </Card>
    </main>
  );
};

export default Subscription;
