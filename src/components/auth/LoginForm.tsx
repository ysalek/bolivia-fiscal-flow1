
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn, Building2 } from "lucide-react";
import { useAuth } from './AuthProvider';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [emailOrUsuario, setEmailOrUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(emailOrUsuario, password);
      if (!success) {
        setError('Email/Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError('Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-primary opacity-10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-success opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3 animate-fade-in-up">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-2xl blur-xl"></div>
              <div className="relative w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gradient-primary">
            Sistema Contable
          </h1>
          <p className="text-muted-foreground">
            Gestión contable profesional para Bolivia
          </p>
        </div>

        {/* Login Form */}
        <Card className="card-glass animate-scale-in backdrop-blur-xl border-border/50 shadow-xl" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrUsuario" className="text-sm font-medium">Email o Usuario</Label>
                <Input
                  id="emailOrUsuario"
                  type="text"
                  value={emailOrUsuario}
                  onChange={(e) => setEmailOrUsuario(e.target.value)}
                  placeholder="admin@empresa.com o admin"
                  required
                  disabled={isLoading}
                  className="transition-smooth focus:shadow-md"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="transition-smooth focus:shadow-md"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="animate-scale-in">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full btn-gradient text-white font-medium h-11" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>
            <div className="pt-4 text-sm text-center space-y-2">
              <div className="text-muted-foreground">
                ¿No tienes cuenta? <Link to="/signup" className="text-primary font-medium hover:underline transition-smooth">Crear cuenta</Link>
              </div>
              <div className="text-muted-foreground">
                <Link to="/web" className="text-primary font-medium hover:underline transition-smooth">Conoce el sistema</Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Info */}
        <div className="grid grid-cols-1 gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card className="card-glass backdrop-blur-xl border-border/50 transition-smooth hover:shadow-lg hover:scale-[1.02]">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">📊</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Contabilidad Integral</div>
                  <div className="text-xs text-muted-foreground">Plan de cuentas actualizado 2025</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass backdrop-blur-xl border-border/50 transition-smooth hover:shadow-lg hover:scale-[1.02]">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-success rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">🧾</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Facturación Electrónica</div>
                  <div className="text-xs text-muted-foreground">Compatible con SIN Bolivia</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass backdrop-blur-xl border-border/50 transition-smooth hover:shadow-lg hover:scale-[1.02]">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-warning rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">📈</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Reportes Inteligentes</div>
                  <div className="text-xs text-muted-foreground">Estados financieros automáticos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
