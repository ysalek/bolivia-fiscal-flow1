
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';

const GeneralLedgerView = () => {
    const { getLibroMayor } = useContabilidadIntegration();
    const [selectedAccount, setSelectedAccount] = useState<string>('');
    
    const libroMayorData = useMemo(() => getLibroMayor(), [getLibroMayor]);
    const accounts = useMemo(() => Object.values(libroMayorData).sort((a, b) => a.codigo.localeCompare(b.codigo)), [libroMayorData]);

    const selectedAccountData = libroMayorData[selectedAccount];

    const getTipoCuenta = (codigo: string): 'deudor' | 'acreedor' => {
        // Activos (1), Costos (5), Gastos (6) son de naturaleza deudora
        if (codigo.startsWith('1') || codigo.startsWith('5') || codigo.startsWith('6')) {
            return 'deudor';
        }
        // Pasivos (2), Patrimonio (3), Ingresos (4) son de naturaleza acreedora
        return 'acreedor';
    };

    const calculateRunningBalance = (movimientos: any[], tipoCuenta: 'deudor' | 'acreedor') => {
        let balance = 0;
        return movimientos.map(mov => {
            if (tipoCuenta === 'deudor') {
                balance += mov.debe - mov.haber;
            } else { // acreedor
                balance += mov.haber - mov.debe;
            }
            return { ...mov, saldo: balance };
        });
    }

    const detailedMovements = selectedAccountData ? calculateRunningBalance(selectedAccountData.movimientos, getTipoCuenta(selectedAccountData.codigo)) : [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Libro Mayor</CardTitle>
                <CardDescription>Consulta los movimientos y saldos de cada cuenta contable.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="max-w-sm">
                     <Select onValueChange={setSelectedAccount} value={selectedAccount}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione una cuenta" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map(account => (
                                <SelectItem key={account.codigo} value={account.codigo}>
                                    {account.codigo} - {account.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedAccountData && (
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalle de la Cuenta: {selectedAccountData.codigo} - {selectedAccountData.nombre}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Debe</p>
                                        <p className="text-lg font-bold">Bs. {selectedAccountData.totalDebe.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Haber</p>
                                        <p className="text-lg font-bold">Bs. {selectedAccountData.totalHaber.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Saldo Final</p>
                                        <p className="text-lg font-bold">Bs. {(getTipoCuenta(selectedAccountData.codigo) === 'deudor' ? selectedAccountData.totalDebe - selectedAccountData.totalHaber : selectedAccountData.totalHaber - selectedAccountData.totalDebe).toFixed(2)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Concepto</TableHead>
                                        <TableHead className="text-right">Debe</TableHead>
                                        <TableHead className="text-right">Haber</TableHead>
                                        <TableHead className="text-right">Saldo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {detailedMovements.map((mov, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{mov.fecha}</TableCell>
                                            <TableCell className="max-w-[300px] truncate">{mov.concepto}</TableCell>
                                            <TableCell className="text-right">{mov.debe > 0 ? `Bs. ${mov.debe.toFixed(2)}` : '-'}</TableCell>
                                            <TableCell className="text-right">{mov.haber > 0 ? `Bs. ${mov.haber.toFixed(2)}` : '-'}</TableCell>
                                            <TableCell className="text-right">Bs. {mov.saldo.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
                {!selectedAccountData && accounts.length > 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>Seleccione una cuenta para ver sus movimientos.</p>
                    </div>
                )}
                 {!accounts.length && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No hay datos en el libro diario para generar el libro mayor.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default GeneralLedgerView;
