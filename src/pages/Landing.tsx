import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Building2, ShieldCheck, ReceiptText, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/components/cms/SiteContentProvider';

const ICONS = { ShieldCheck, ReceiptText, BarChart3 } as const;

const Landing = () => {
  const { content } = useSiteContent();

  useEffect(() => {
    document.title = `${content.productName} | Sistema contable en la nube por $${content.pricingUSD}/${content.pricingPeriod.replace('/', '')}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', `${content.productName}: ${content.heroSubtitle}`);
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = window.location.href;

    // JSON-LD Product
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: content.productName,
      description: content.heroSubtitle,
      offers: { '@type': 'Offer', price: String(content.pricingUSD), priceCurrency: 'USD' },
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [content]);

  return (
    <main>
      <header className="container mx-auto px-4 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold">{content.brandName}</span>
        </div>
        <div className="flex gap-2">
          <Link to="/signup"><Button size="sm">Crear cuenta</Button></Link>
          <Link to="/suscripcion"><Button size="sm" variant="outline">Suscripción</Button></Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <h1 className="text-3xl font-bold leading-tight">{content.heroTitle}</h1>
          <p className="text-muted-foreground">{content.heroSubtitle}</p>
          <div className="flex gap-2">
            <Link to={content.ctaPrimaryHref}><Button>{content.ctaPrimaryLabel}</Button></Link>
            <a href={content.ctaSecondaryHref}><Button variant="outline">{content.ctaSecondaryLabel}</Button></a>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary"/> IVA incluido y asientos automáticos</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary"/> Kardex, compras, ventas y POS</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary"/> Multiempresa por subdominio o carpeta</li>
          </ul>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">${content.pricingUSD}</div>
                <div className="text-xs text-muted-foreground">{content.pricingPeriod}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs text-muted-foreground">Soporte</div>
              </div>
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-xs text-muted-foreground">Web</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="caracteristicas" className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
        {content.features.map((f) => {
          const Icon = ICONS[f.icon];
          return (
            <Card key={f.id}>
              <CardContent className="p-6 space-y-2">
                <Icon className="w-6 h-6 text-primary"/>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Plan único ${content.pricingUSD}{content.pricingPeriod}</h2>
        <p className="text-muted-foreground mb-6">{content.pricingDescription}</p>
        <Link to="/signup"><Button size="lg">Crear mi cuenta</Button></Link>
      </section>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} {content.brandName}</span>
          <div className="space-x-4">
            {content.footerLinks.map((l) => (
              l.href.startsWith('http') ? (
                <a key={l.href} href={l.href}>{l.label}</a>
              ) : (
                <Link key={l.href} to={l.href}>{l.label}</Link>
              )
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;

