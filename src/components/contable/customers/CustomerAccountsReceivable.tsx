
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, DollarSign, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { Factura } from "../billing/BillingData";

interface CustomerReceivableInfo {
  clienteId: string;
  clienteNombre: string;
  clienteNit: string;
  totalPorCobrar: number;
  facturasPendientes: Factura[];
  ultimaCompra: {
    fecha: string;
    monto: number;
    numero: string;
  } | null;
  anticiposRecibidos: number;
  diasPromedioPago: number;
  clasificacionRiesgo: 'Bajo' | 'Medio' | 'Alto';
}

const CustomerAccountsReceivable = () => {
  const [cuentasPorCobrar, setCuentasPorCobrar] = useState<CustomerReceivableInfo[]>([]);

  useEffect(() => {
    const facturas: Factura[] = JSON.parse(localStorage.getItem('facturas') || '[]');
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    const anticipos = JSON.parse(localStorage.getItem('anticiposClientes') || '[]');

    const cuentasInfo: CustomerReceivableInfo[] = clientes.map(cliente => {
      const facturasCliente = facturas.filter(f => f.cliente.id === cliente.id);
      const facturasPendientes = facturasCliente.filter(f => f.estado === 'enviada');
      const totalPorCobrar = facturasPendientes.reduce((sum, f) => sum + f.total, 0);
      
      // Última compra
      const facturasOrdenadas = facturasCliente.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      const ultimaCompra = facturasOrdenadas.length > 0 ? {
        fecha: facturasOrdenadas[0].fecha,
        monto: facturasOrdenadas[0].total,
        numero: facturasOrdenadas[0].numero
      } : null;

      // Anticipos recibidos
      const anticiposCliente = anticipos
        .filter(a => a.clienteId === cliente.id && a.estado === 'activo')
        .reduce((sum, a) => sum + a.monto, 0);

      // Cálculo de días promedio de pago
      const facturasVencidas = facturasPendientes.filter(f => 
        new Date(f.fechaVencimiento) < new Date()
      );
      const diasPromedio = facturasVencidas.length > 0 
        ? facturasVencidas.reduce((sum, f) => {
            const diasVencido = Math.floor(
              (new Date().getTime() - new Date(f.fechaVencimiento).getTime()) / (1000 * 60 * 60 * 24)
            );
            return sum + diasVencido;
          }, 0) / facturasVencidas.length
        : 0;

      // Clasificación de riesgo
      let clasificacionRiesgo: 'Bajo' | 'Medio' | 'Alto' = 'Bajo';
      if (diasPromedio > 60 || totalPorCobrar > 10000) clasificacionRiesgo = 'Alto';
      else if (diasPromedio > 30 || totalPorCobrar > 5000) clasificacionRiesgo = 'Medio';

      return {
        clienteId: cliente.id,
        clienteNombre: cliente.nombre,
        clienteNit: cliente.nit,
        totalPorCobrar: totalPorCobrar - anticiposCliente, // Restamos anticipos
        facturasPendientes,
        ultimaCompra,
        anticiposRecibidos: anticiposCliente,
        diasPromedioPago: diasPromedio,
        clasificacionRiesgo
      };
    }).filter(info => info.totalPorCobrar > 0 || info.anticiposRecibidos > 0);

    setCuentasPorCobrar(cuentasInfo);
  }, []);

  const getRiskColor = (riesgo: string) => {
    switch (riesgo) {
      case 'Alto': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const totalGeneral = cuentasPorCobrar.reduce((sum, c) => sum + c.totalPorCobrar, 0);
  const totalAnticipos = cuentasPorCobrar.reduce((sum, c) => sum + c.anticiposRecibidos, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total por Cobrar</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {totalGeneral.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Saldo neto después de anticipos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anticipos Recibidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {totalAnticipos.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Aplicados como crédito</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes con Deuda</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cuentasPorCobrar.length}</div>
            <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Nota Contable:</strong> Los anticipos de clientes se registran como pasivo (cuenta 2xxx) y se aplican en negativo a las cuentas por cobrar para mostrar el saldo real pendiente.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de Cuentas por Cobrar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead className="text-right">Saldo Bruto</TableHead>
                <TableHead className="text-right">Anticipos</TableHead>
                <TableHead className="text-right">Saldo Neto</TableHead>
                <TableHead className="text-center">Días Prom.</TableHead>
                <TableHead className="text-center">Riesgo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cuentasPorCobrar.map((cuenta) => (
                <TableRow key={cuenta.clienteId}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{cuenta.clienteNombre}</p>
                      <p className="text-sm text-muted-foreground">{cuenta.clienteNit}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {cuenta.ultimaCompra ? (
                      <div>
                        <p className="text-sm">{new Date(cuenta.ultimaCompra.fecha).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {cuenta.ultimaCompra.numero} - Bs. {cuenta.ultimaCompra.monto.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Sin compras</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    Bs. {(cuenta.totalPorCobrar + cuenta.anticiposRecibidos).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {cuenta.anticiposRecibidos > 0 ? (
                      <span className="text-green-600">-Bs. {cuenta.anticiposRecibidos.toFixed(2)}</span>
                    ) : (
                      <span className="text-muted-foreground">0.00</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    Bs. {cuenta.totalPorCobrar.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {cuenta.diasPromedioPago > 0 ? Math.round(cuenta.diasPromedioPago) : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getRiskColor(cuenta.clasificacionRiesgo)}>
                      {cuenta.clasificacionRiesgo}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAccountsReceivable;
