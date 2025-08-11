import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [nitOrCI, setNitOrCI] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Crear cuenta | SaaS Contable';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Regístrate para acceder al sistema contable SaaS ($35/mes).');
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = window.location.href;
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = register({ nombre, email, telefono, empresa, nitOrCI, password });
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'No fue posible crear la cuenta');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>Plan único $35/mes. Complete sus datos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input id="empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nit">NIT o CI</Label>
              <Input id="nit" value={nitOrCI} onChange={(e) => setNitOrCI(e.target.value)} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && (
              <div className="md:col-span-2 text-sm text-red-600">{error}</div>
            )}
            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Signup;
