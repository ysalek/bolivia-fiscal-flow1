import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Building2, ShieldCheck, ReceiptText, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  useEffect(() => {
    document.title = 'ContabilidadPro | Sistema contable en la nube';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Sistema contable completo en la nube para empresas bolivianas');
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) { 
      link = document.createElement('link'); 
      link.rel = 'canonical'; 
      document.head.appendChild(link); 
    }
    link.href = window.location.href;
  }, []);

  return (
    <main>
      <header className="container mx-auto px-4 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold">ContabilidadPro</span>
        </div>
        <div className="flex gap-2">
          <Link to="/signup"><Button size="sm">Crear cuenta</Button></Link>
          <Link to="/"><Button size="sm" variant="outline">Acceder</Button></Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <h1 className="text-3xl font-bold leading-tight">Sistema Contable Completo</h1>
          <p className="text-muted-foreground">Gestiona tu contabilidad de manera profesional con nuestro sistema completo que incluye facturación, inventarios, reportes y más.</p>
          <div className="flex gap-2">
            <Link to="/signup"><Button>Empezar Ahora</Button></Link>
            <Link to="/"><Button variant="outline">Ver Demo</Button></Link>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary"/> IVA incluido y asientos automáticos</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary"/> Kardex, compras, ventas y POS</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary"/> Reportes contables completos</li>
          </ul>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">Gratis</div>
                <div className="text-xs text-muted-foreground">Por ahora</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs text-muted-foreground">Disponible</div>
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
            <h3 className="font-semibold">Seguridad Avanzada</h3>
            <p className="text-sm text-muted-foreground">Protección de datos con autenticación segura y respaldos automáticos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <ReceiptText className="w-6 h-6 text-primary"/>
            <h3 className="font-semibold">Facturación Electrónica</h3>
            <p className="text-sm text-muted-foreground">Sistema completo de facturación con cumplimiento normativo boliviano</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <BarChart3 className="w-6 h-6 text-primary"/>
            <h3 className="font-semibold">Reportes Inteligentes</h3>
            <p className="text-sm text-muted-foreground">Análisis financiero completo con reportes contables profesionales</p>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Comienza Gratis</h2>
        <p className="text-muted-foreground mb-6">Accede a todas las funcionalidades sin costo inicial</p>
        <Link to="/signup"><Button size="lg">Crear mi cuenta</Button></Link>
      </section>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} ContabilidadPro</span>
          <div className="space-x-4">
            <Link to="/">Inicio</Link>
            <Link to="/signup">Registro</Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;