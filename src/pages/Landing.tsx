import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Building2, ShieldCheck, ReceiptText, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  useEffect(() => {
    document.title = 'Contabol SaaS | Sistema contable en la nube por $35/mes';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Sistema contable boliviano: facturación, libros, IVA, reportes y POS. Plan único $35/mes.');
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = window.location.href;

    // JSON-LD Product
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Contabol SaaS',
      description: 'Sistema contable boliviano en la nube',
      offers: { '@type': 'Offer', price: '35', priceCurrency: 'USD' }
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <main>
      <header className="container mx-auto px-4 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold">Contabol</span>
        </div>
        <div className="flex gap-2">
          <Link to="/signup"><Button size="sm">Crear cuenta</Button></Link>
          <Link to="/suscripcion"><Button size="sm" variant="outline">Suscripción</Button></Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <h1 className="text-3xl font-bold leading-tight">Sistema contable boliviano en la nube por $35/mes</h1>
          <p className="text-muted-foreground">Facturación, libros, IVA (débito/crédito fiscal), reportes, POS y más. Cumple normativa y escala por empresa (multi-tenant).</p>
          <div className="flex gap-2">
            <Link to="/signup"><Button>Comenzar gratis</Button></Link>
            <a href="#caracteristicas"><Button variant="outline">Ver características</Button></a>
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
                <div className="text-2xl font-bold">$35</div>
                <div className="text-xs text-muted-foreground">/mes</div>
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
        <Card>
          <CardContent className="p-6 space-y-2">
            <ShieldCheck className="w-6 h-6 text-primary"/>
            <h3 className="font-semibold">Cumplimiento tributario</h3>
            <p className="text-sm text-muted-foreground">IVA, IT, libros diario/mayor, planes de cuentas y reportes exigidos.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <ReceiptText className="w-6 h-6 text-primary"/>
            <h3 className="font-semibold">Facturación y POS</h3>
            <p className="text-sm text-muted-foreground">Ventas al contado/crédito, comprobantes y control de inventario.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <BarChart3 className="w-6 h-6 text-primary"/>
            <h3 className="font-semibold">Reportes financieros</h3>
            <p className="text-sm text-muted-foreground">Balance general, resultados y flujo de efectivo con métricas clave.</p>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Plan único $35/mes</h2>
        <p className="text-muted-foreground mb-6">Sin costos ocultos. Puedes crecer por empresa (subdominio o carpeta).</p>
        <Link to="/signup"><Button size="lg">Crear mi cuenta</Button></Link>
      </section>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} Contabol</span>
          <div className="space-x-4">
            <a href="#caracteristicas">Características</a>
            <Link to="/suscripcion">Suscripción</Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
