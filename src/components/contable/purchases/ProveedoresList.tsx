
import { Proveedor } from "./PurchasesData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProveedoresListProps {
  proveedores: Proveedor[];
}

const ProveedoresList = ({ proveedores }: ProveedoresListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proveedores Activos</CardTitle>
        <CardDescription>Base de datos de proveedores</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>NIT</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proveedores.length > 0 ? (
              proveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                  <TableCell>{proveedor.nit}</TableCell>
                  <TableCell>{proveedor.email}</TableCell>
                  <TableCell>{proveedor.telefono}</TableCell>
                  <TableCell>
                    <Badge className={proveedor.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {proveedor.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron proveedores.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProveedoresList;
