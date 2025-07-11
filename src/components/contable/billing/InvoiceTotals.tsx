
import { calcularIVA, calcularTotal } from "./BillingData";
import { AlertCircle } from "lucide-react";

interface InvoiceTotalsProps {
  subtotal: number;
  discountTotal: number;
  error?: string;
}

const InvoiceTotals = ({ subtotal, discountTotal, error }: InvoiceTotalsProps) => {
  const finalTotal = calcularTotal(subtotal);

  return (
    <div className="flex justify-end">
      <div className="w-64 space-y-2 p-4 bg-gray-50 rounded-lg">
        {discountTotal > 0 && (
          <div className="flex justify-between">
            <span>Descuento:</span>
            <span>- Bs. {discountTotal.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total a Pagar:</span>
          <span>Bs. {finalTotal.toFixed(2)}</span>
        </div>
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default InvoiceTotals;
