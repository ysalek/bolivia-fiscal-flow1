
import { useState, useEffect } from "react";
import EnhancedFinancialDashboard from "./dashboard/EnhancedFinancialDashboard";
import { Factura, facturasIniciales } from "./billing/BillingData";
import { AsientoContable, asientosIniciales } from "./diary/DiaryData";
import { Producto, productosIniciales } from "./products/ProductsData";

const Dashboard = () => {
  const [facturas, setFacturas] = useState<Factura[]>(facturasIniciales);
  const [asientos, setAsientos] = useState<AsientoContable[]>(asientosIniciales);
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);

  // Cargar datos desde localStorage
  useEffect(() => {
    const facturasGuardadas = localStorage.getItem('facturas');
    if (facturasGuardadas) {
      setFacturas(JSON.parse(facturasGuardadas));
    }

    const asientosGuardados = localStorage.getItem('asientosContables');
    if (asientosGuardados) {
      setAsientos(JSON.parse(asientosGuardados));
    }

    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
    }
  }, []);

  return (
    <EnhancedFinancialDashboard 
      facturas={facturas}
      asientos={asientos}
      productos={productos}
    />
  );
};

export default Dashboard;
