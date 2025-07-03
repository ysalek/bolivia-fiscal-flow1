
import { useState } from 'react';
import { useReportesContables } from '@/hooks/useReportesContables';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Scale, FileWarning, Filter } from 'lucide-react';

const BalanceComprobacionModule = () => {
    const { getTrialBalanceData } = useReportesContables();
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [cuentaInicio, setCuentaInicio] = useState('');
    const [cuentaFin, setCuentaFin] = useState('');
    const [formato4Columnas, setFormato4Columnas] = useState(false);
    
    const { details, totals } = getTrialBalanceData({ fechaInicio, fechaFin, cuentaInicio, cuentaFin });

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
                        {/* Filtros */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                                    <div>
                                        <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                                        <Input
                                            id="fechaInicio"
                                            type="date"
                                            value={fechaInicio}
                                            onChange={(e) => setFechaInicio(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="fechaFin">Fecha Fin</Label>
                                        <Input
                                            id="fechaFin"
                                            type="date"
                                            value={fechaFin}
                                            onChange={(e) => setFechaFin(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="cuentaInicio">Cuenta Inicio</Label>
                                        <Input
                                            id="cuentaInicio"
                                            placeholder="Ej: 1000"
                                            value={cuentaInicio}
                                            onChange={(e) => setCuentaInicio(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="cuentaFin">Cuenta Fin</Label>
                                        <Input
                                            id="cuentaFin"
                                            placeholder="Ej: 9999"
                                            value={cuentaFin}
                                            onChange={(e) => setCuentaFin(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="formato4Columnas"
                                            checked={formato4Columnas}
                                            onCheckedChange={setFormato4Columnas}
                                        />
                                        <Label htmlFor="formato4Columnas">Formato 4 Columnas</Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabla del Balance */}
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Cuenta</TableHead>
                                        {formato4Columnas ? (
                                            <>
                                                <TableHead className="text-right">Debe</TableHead>
                                                <TableHead className="text-right">Haber</TableHead>
                                            </>
                                        ) : (
                                            <>
                                                <TableHead className="text-right">Debe (Sumas)</TableHead>
                                                <TableHead className="text-right">Haber (Sumas)</TableHead>
                                                <TableHead className="text-right">Deudor (Saldos)</TableHead>
                                                <TableHead className="text-right">Acreedor (Saldos)</TableHead>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {details.map((cuenta) => (
                                        <TableRow key={cuenta.codigo}>
                                            <TableCell>{cuenta.codigo}</TableCell>
                                            <TableCell className="max-w-[300px] truncate">{cuenta.nombre}</TableCell>
                                            {formato4Columnas ? (
                                                <>
                                                    <TableCell className="text-right">
                                                        {cuenta.sumaDebe > 0 ? `Bs. ${cuenta.sumaDebe.toFixed(2)}` : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {cuenta.sumaHaber > 0 ? `Bs. ${cuenta.sumaHaber.toFixed(2)}` : '-'}
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell className="text-right">Bs. {cuenta.sumaDebe.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right">Bs. {cuenta.sumaHaber.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right">{cuenta.saldoDeudor > 0 ? `Bs. ${cuenta.saldoDeudor.toFixed(2)}` : '-'}</TableCell>
                                                    <TableCell className="text-right">{cuenta.saldoAcreedor > 0 ? `Bs. ${cuenta.saldoAcreedor.toFixed(2)}` : '-'}</TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow className="bg-muted/50 font-bold">
                                        <TableCell colSpan={2}>Totales</TableCell>
                                        {formato4Columnas ? (
                                            <>
                                                <TableCell className={`text-right ${!totalsMatch ? 'text-red-500' : ''}`}>
                                                    Bs. {totals.sumaDebe.toFixed(2)}
                                                </TableCell>
                                                <TableCell className={`text-right ${!totalsMatch ? 'text-red-500' : ''}`}>
                                                    Bs. {totals.sumaHaber.toFixed(2)}
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell className={`text-right ${!totalsMatch ? 'text-red-500' : ''}`}>Bs. {totals.sumaDebe.toFixed(2)}</TableCell>
                                                <TableCell className={`text-right ${!totalsMatch ? 'text-red-500' : ''}`}>Bs. {totals.sumaHaber.toFixed(2)}</TableCell>
                                                <TableCell className={`text-right ${!balancesMatch ? 'text-red-500' : ''}`}>Bs. {totals.saldoDeudor.toFixed(2)}</TableCell>
                                                <TableCell className={`text-right ${!balancesMatch ? 'text-red-500' : ''}`}>Bs. {totals.saldoAcreedor.toFixed(2)}</TableCell>
                                            </>
                                        )}
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
