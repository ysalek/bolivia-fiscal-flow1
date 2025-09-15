import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthDebugInfo = () => {
  const { isAuthenticated, user, session } = useAuth();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Estado de Autenticación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Autenticado:</strong> {isAuthenticated ? 'Sí' : 'No'}
          </div>
          <div>
            <strong>Session ID:</strong> {session?.user?.id || 'No disponible'}
          </div>
          <div>
            <strong>Email:</strong> {session?.user?.email || 'No disponible'}
          </div>
          <div>
            <strong>Usuario:</strong> {user?.nombre || 'No disponible'}
          </div>
          <div>
            <strong>Rol:</strong> {user?.rol || 'No disponible'}
          </div>
          <div>
            <strong>Access Token:</strong> {session?.access_token ? 'Presente' : 'No disponible'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDebugInfo;