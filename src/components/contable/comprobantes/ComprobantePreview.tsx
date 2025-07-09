import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Calendar, User, MapPin, Printer, Download } from "lucide-react";

interface CuentaContable {
  codigo: string;
  nombre: string;
  debe: number;
  haber: number;
}

interface ComprobantePreviewProps {
  comprobante: {
    id: string;
    tipo: 'ingreso' | 'egreso' | 'traspaso';
    numero: string;
    fecha: string;
    concepto: string;
    beneficiario: string;
    monto: number;
    metodoPago: string;
    referencia: string;
    observaciones: string;
    estado: 'borrador' | 'autorizado' | 'anulado';
    creadoPor: string;
    fechaCreacion: string;
    cuentas: CuentaContable[];
  };
  onClose: () => void;
}

const ComprobantePreview = ({ comprobante, onClose }: ComprobantePreviewProps) => {
  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'ingreso': return 'COMPROBANTE DE INGRESO';
      case 'egreso': return 'COMPROBANTE DE EGRESO';
      case 'traspaso': return 'COMPROBANTE DE TRASPASO';
      default: return 'COMPROBANTE';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'ingreso': return 'text-green-600';
      case 'egreso': return 'text-red-600';
      case 'traspaso': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'autorizado': return 'bg-green-100 text-green-800 border-green-200';
      case 'anulado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const totalDebe = comprobante.cuentas.reduce((sum, cuenta) => sum + cuenta.debe, 0);
  const totalHaber = comprobante.cuentas.reduce((sum, cuenta) => sum + cuenta.haber, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header del Comprobante */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">SISTEMA CONTABLE EMPRESARIAL</h1>
            <p className="text-sm text-gray-600">NIT: 1234567890 - La Paz, Bolivia</p>
          </div>
          <div className="text-right">
            <h2 className={`text-xl font-bold ${getTipoColor(comprobante.tipo)}`}>
              {getTipoLabel(comprobante.tipo)}
            </h2>
            <p className="text-lg font-semibold">{comprobante.numero}</p>
            <Badge className={getEstadoColor(comprobante.estado)}>
              {comprobante.estado.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Información del Comprobante */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fecha:</span>
              <span className="text-sm font-medium">
                {new Date(comprobante.fecha).toLocaleDateString('es-BO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Monto Total:</span>
              <span className="text-sm font-medium">Bs. {comprobante.monto.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Referencia:</span>
              <span className="text-sm font-medium">{comprobante.referencia || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              Detalles de la Transacción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Beneficiario/Pagador:</span>
              <span className="text-sm font-medium">{comprobante.beneficiario}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Creado por:</span>
              <span className="text-sm font-medium">{comprobante.creadoPor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fecha de creación:</span>
              <span className="text-sm font-medium">
                {new Date(comprobante.fechaCreacion).toLocaleDateString('es-BO')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Concepto */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Concepto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{comprobante.concepto}</p>
        </CardContent>
      </Card>

      {/* Asiento Contable */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Asiento Contable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Código</TableHead>
                <TableHead>Nombre de la Cuenta</TableHead>
                <TableHead className="text-right w-32">Debe (Bs.)</TableHead>
                <TableHead className="text-right w-32">Haber (Bs.)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comprobante.cuentas.map((cuenta, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{cuenta.codigo}</TableCell>
                  <TableCell className="text-sm">{cuenta.nombre}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {cuenta.debe > 0 ? cuenta.debe.toFixed(2) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {cuenta.haber > 0 ? cuenta.haber.toFixed(2) : '-'}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 font-semibold">
                <TableCell colSpan={2} className="text-right">TOTALES:</TableCell>
                <TableCell className="text-right font-mono">
                  Bs. {totalDebe.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  Bs. {totalHaber.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Observaciones */}
      {comprobante.observaciones && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{comprobante.observaciones}</p>
          </CardContent>
        </Card>
      )}

      {/* Firmas */}
      <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t">
        <div className="text-center">
          <div className="border-t border-gray-400 mt-12 pt-2">
            <p className="text-sm font-medium">Elaborado por</p>
            <p className="text-xs text-gray-600">{comprobante.creadoPor}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 mt-12 pt-2">
            <p className="text-sm font-medium">Revisado por</p>
            <p className="text-xs text-gray-600">Contador General</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 mt-12 pt-2">
            <p className="text-sm font-medium">Autorizado por</p>
            <p className="text-xs text-gray-600">Gerente General</p>
          </div>
        </div>
      </div>

      {/* Acciones (solo para pantalla) */}
      <div className="flex justify-end gap-2 mt-6 print:hidden">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
};

export default ComprobantePreview;