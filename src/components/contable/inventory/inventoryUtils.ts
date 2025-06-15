
import { ProductoInventario } from "./InventoryData";

export const getStockStatus = (producto: ProductoInventario) => {
  if (producto.categoria === "Servicios") return "service";
  if (producto.stockActual <= producto.stockMinimo) return "low";
  if (producto.stockActual >= producto.stockMaximo) return "high";
  return "normal";
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "low": return "bg-red-100 text-red-800";
    case "high": return "bg-yellow-100 text-yellow-800";
    case "service": return "bg-blue-100 text-blue-800";
    default: return "bg-green-100 text-green-800";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "low": return "Stock Bajo";
    case "high": return "Stock Alto";
    case "service": return "Servicio";
    default: return "Normal";
  }
};
