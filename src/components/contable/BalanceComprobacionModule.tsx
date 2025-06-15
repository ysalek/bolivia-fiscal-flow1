
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Scale, FileWarning } from 'lucide-react';

const BalanceComprobacionModule = () => {
    const { getTrialBalanceData } = useContabilidadIntegration();
    const { details, totals } = getTrialBalanceData();

    const totalsMatch = Math.abs(totals.sumaDebe - totals.sumaHaber) < 0.01;
    const balancesMatch = Math.abs(totals.saldoDeudor - totals.saldoAcreedor) < 0.01;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Scale className="w-6 h-6" />
                    Balance de Comprobación de Sumas y Saldos
                </CardTitle>
                <CardDescription>
                    Verifica que la suma de los débitos sea igual a la suma de los créditos, y que la suma de los saldos deudores sea igual a la de los acreedores.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {details.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No hay datos suficientes para generar el balance de comprobación.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Cuenta</TableHead>
                                        <TableHead className="text-right">Debe (Sumas)</TableHead>
                                        <TableHead className="text-right">Haber (Sumas)</TableHead>
                                        <TableHead className="text-right">Deudor (Saldos)</TableHead>
                                        <TableHead className="text-right">Acreedor (Saldos)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {details.map((cuenta) => (
                                        <TableRow key={cuenta.codigo}>
                                            <TableCell>{cuenta.codigo}</TableCell>
                                            <TableCell className="max-w-[300px] truncate">{cuenta.nombre}</TableCell>
                                            <TableCell className="text-right">Bs. {cuenta.sumaDebe.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">Bs. {cuenta.sumaHaber.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{cuenta.saldoDeudor > 0 ? `Bs. ${cuenta.saldoDeudor.toFixed(2)}` : '-'}</TableCell>
                                            <TableCell className="text-right">{cuenta.saldoAcreedor > 0 ? `Bs. ${cuenta.saldoAcreedor.toFixed(2)}` : '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow className="bg-muted/50 font-bold">
                                        <TableCell colSpan={2}>Totales</TableCell>
                                        <TableCell className={`text-right ${!totalsMatch ? 'text-red-500' : ''}`}>Bs. {totals.sumaDebe.toFixed(2)}</TableCell>
                                        <TableCell className={`text-right ${!totalsMatch ? 'text-red-500' : ''}`}>Bs. {totals.sumaHaber.toFixed(2)}</TableCell>
                                        <TableCell className={`text-right ${!balancesMatch ? 'text-red-500' : ''}`}>Bs. {totals.saldoDeudor.toFixed(2)}</TableCell>
                                        <TableCell className={`text-right ${!balancesMatch ? 'text-red-500' : ''}`}>Bs. {totals.saldoAcreedor.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                        {(!totalsMatch || !balancesMatch) && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3 text-red-800">
                                <FileWarning className="w-5 h-5" />
                                <div>
                                    <h4 className="font-bold">¡Descuadre Contable!</h4>
                                    <p className="text-sm">Los totales de sumas y/o saldos no coinciden. Por favor, revise los asientos contables.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BalanceComprobacionModule;
