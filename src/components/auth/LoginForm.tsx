
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

  const credencialesProduccion = [
    { 
      role: 'Administrador', 
      email: 'ysalek@gmail.com', 
      usuario: 'ysalek',
      password: 'Tu contraseña de registro' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Sistema Contable
          </h1>
          <p className="text-slate-600">
            Inicie sesión para acceder al sistema
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrUsuario">Email o Usuario</Label>
                <Input
                  id="emailOrUsuario"
                  type="text"
                  value={emailOrUsuario}
                  onChange={(e) => setEmailOrUsuario(e.target.value)}
                  placeholder="admin@empresa.com o admin"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
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
            <div className="pt-2 text-sm text-center text-slate-600 space-y-1">
              <div>¿No tienes cuenta? <Link to="/signup" className="text-blue-600 underline">Crear cuenta</Link></div>
              <div><Link to="/web" className="text-blue-600 underline">Conoce el sistema (sitio web)</Link></div>
            </div>
          </CardContent>
        </Card>

        {/* Production Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Credenciales del Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {credencialesProduccion.map((cred, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-sm">{cred.role}</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Email: {cred.email}</div>
                  <div>Usuario: {cred.usuario}</div>
                  <div>Contraseña: {cred.password}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs flex-1"
                    onClick={() => {
                      setEmailOrUsuario(cred.email);
                      setPassword(cred.password);
                    }}
                  >
                    Usar Email
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs flex-1"
                    onClick={() => {
                      setEmailOrUsuario(cred.usuario);
                      setPassword(cred.password);
                    }}
                  >
                    Usar Usuario
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
