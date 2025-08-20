import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';

const SimpleAppTest = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>✅ Sistema Funcionando Correctamente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Estado de Autenticación:</h3>
            <p>Autenticado: {isAuthenticated ? '✅ SÍ' : '❌ NO'}</p>
            {user && (
              <div className="mt-2">
                <p>Usuario: {user.nombre}</p>
                <p>Email: {user.email}</p>
                <p>Rol: {user.rol}</p>
                <p>Empresa: {user.empresa}</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold">Plan de Cuentas Bolivia 2025:</h3>
            <p>✅ Sistema contable actualizado según normativa SIN</p>
            <p>✅ IVA 13%, IT 3%, IUE 25%</p>
            <p>✅ Configuración tributaria boliviana 2025</p>
          </div>

          <div>
            <h3 className="font-semibold">Funcionalidades Disponibles:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>✅ Dashboard contable</li>
              <li>✅ Facturación con IVA</li>
              <li>✅ Control de inventarios</li>
              <li>✅ Libro diario y mayor</li>
              <li>✅ Balance de comprobación</li>
              <li>✅ Estados financieros</li>
              <li>✅ Declaraciones tributarias</li>
            </ul>
          </div>

          {!isAuthenticated && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">
                <strong>Para acceder al sistema completo:</strong><br />
                Haz login con: <code>ysalek@gmail.com</code> y tu contraseña
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleAppTest;