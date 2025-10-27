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
    <main className="bg-gradient-subtle min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-xl blur-md"></div>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="font-bold text-lg text-gradient-primary">ContabilidadPro</span>
        </div>
        <div className="flex gap-2">
          <Link to="/signup"><Button size="sm" className="btn-gradient text-white">Crear cuenta</Button></Link>
          <Link to="/"><Button size="sm" variant="outline">Acceder</Button></Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="text-gradient-primary">Sistema Contable</span>
              <br />
              Completo y Profesional
            </h1>
            <p className="text-lg text-muted-foreground">
              Gestiona tu contabilidad de manera profesional con nuestro sistema integral que incluye facturación, inventarios, reportes financieros y cumplimiento normativo boliviano.
            </p>
            <div className="flex gap-3">
              <Link to="/signup">
                <Button size="lg" className="btn-gradient text-white font-medium">
                  Empezar Gratis
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline" className="font-medium">
                  Ver Demo
                </Button>
              </Link>
            </div>
            <ul className="space-y-3 pt-4">
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <span>IVA automático y asientos contables</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <span>Kardex, compras, ventas y punto de venta</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <span>Reportes financieros profesionales</span>
              </li>
            </ul>
          </div>

          {/* Stats Card */}
          <Card className="card-modern animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gradient-primary">Gratis</div>
                  <div className="text-sm text-muted-foreground">Sin costos ocultos</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gradient-success">24/7</div>
                  <div className="text-sm text-muted-foreground">Siempre disponible</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gradient-warning">100%</div>
                  <div className="text-sm text-muted-foreground">En la nube</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="container mx-auto px-4 py-16 bg-background/50">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">Funcionalidades Principales</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas para gestionar la contabilidad de tu empresa en un solo lugar
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-modern group animate-fade-in-up" style={{ animationDelay: '0s' }}>
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md group-hover:shadow-glow transition-smooth">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">Seguridad Avanzada</h3>
              <p className="text-sm text-muted-foreground">
                Protección de datos empresariales con autenticación segura, encriptación y respaldos automáticos en la nube.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center shadow-md group-hover:shadow-glow transition-smooth">
                <ReceiptText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">Facturación Completa</h3>
              <p className="text-sm text-muted-foreground">
                Sistema de facturación electrónica con cumplimiento normativo boliviano SIN, generación de CUF y gestión de puntos de venta.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-warning flex items-center justify-center shadow-md group-hover:shadow-glow transition-smooth">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">Reportes Inteligentes</h3>
              <p className="text-sm text-muted-foreground">
                Análisis financiero completo con estados de resultados, balance general, libro mayor y reportes tributarios automáticos.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold">
            Comienza <span className="text-gradient-primary">Gratis</span> Hoy
          </h2>
          <p className="text-lg text-muted-foreground">
            Accede a todas las funcionalidades del sistema sin costo inicial. No requiere tarjeta de crédito.
          </p>
          <Link to="/signup">
            <Button size="lg" className="btn-gradient text-white font-medium text-lg px-8 py-6">
              Crear mi cuenta gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span>© {new Date().getFullYear()} ContabilidadPro. Sistema contable profesional.</span>
            </div>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-primary transition-smooth">Inicio</Link>
              <Link to="/signup" className="hover:text-primary transition-smooth">Registro</Link>
              <Link to="/" className="hover:text-primary transition-smooth">Demo</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;