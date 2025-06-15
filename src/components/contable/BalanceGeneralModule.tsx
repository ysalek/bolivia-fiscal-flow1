
import { useContabilidadIntegration, BalanceSheetAccount } from '@/hooks/useContabilidadIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Landmark, AlertTriangle, BadgeCheck } from 'lucide-react';

const AccountTable = ({ title, accounts, total }: { title: string; accounts: BalanceSheetAccount[]; total: number }) => (
    <div className="border rounded-md">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[120px]">Código</TableHead>
                    <TableHead>{title}</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {accounts.map((cuenta) => (
                    <TableRow key={cuenta.codigo}>
                        <TableCell>{cuenta.codigo}</TableCell>
                        <TableCell>{cuenta.nombre}</TableCell>
                        <TableCell className="text-right">Bs. {cuenta.saldo.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow className="bg-muted/50 font-bold">
                    <TableCell colSpan={2}>Total {title}</TableCell>
                    <TableCell className="text-right">Bs. {total.toFixed(2)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </div>
);

const BalanceGeneralModule = () => {
    const { getBalanceSheetData } = useContabilidadIntegration();
    const { activos, pasivos, patrimonio, totalPasivoPatrimonio, ecuacionCuadrada } = getBalanceSheetData();

    const hasData = activos.cuentas.length > 0 || pasivos.cuentas.length > 0 || patrimonio.cuentas.length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Landmark className="w-6 h-6" />
                    Balance General
                </CardTitle>
                <CardDescription>
                    Presenta la situación financiera de la empresa en una fecha determinada, mostrando activos, pasivos y patrimonio.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!hasData ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No hay datos suficientes para generar el balance general.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {ecuacionCuadrada ? (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-3 text-green-800">
                                <BadgeCheck className="w-5 h-5" />
                                <div>
                                    <h4 className="font-bold">Ecuación Contable Balanceada</h4>
                                    <p className="text-sm">Total Activos = Total Pasivos + Patrimonio.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3 text-red-800">
                                <AlertTriangle className="w-5 h-5" />
                                <div>
                                    <h4 className="font-bold">¡Descuadre Contable Grave!</h4>
                                    <p className="text-sm">El total de activos no coincide con el total de pasivos y patrimonio. Revise los asientos.</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <div className="space-y-4">
                                <AccountTable title="Activos" accounts={activos.cuentas} total={activos.total} />
                            </div>

                            <div className="space-y-6">
                                <AccountTable title="Pasivos" accounts={pasivos.cuentas} total={pasivos.total} />
                                <AccountTable title="Patrimonio" accounts={patrimonio.cuentas} total={patrimonio.total} />
                                
                                <Card className="bg-muted/50">
                                    <CardHeader className="p-4">
                                        <div className="flex justify-between items-center font-bold text-lg">
                                            <span>Total Pasivo + Patrimonio</span>
                                            <span className={`${!ecuacionCuadrada ? 'text-red-500' : ''}`}>
                                                Bs. {totalPasivoPatrimonio.toFixed(2)}
                                            </span>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BalanceGeneralModule;
