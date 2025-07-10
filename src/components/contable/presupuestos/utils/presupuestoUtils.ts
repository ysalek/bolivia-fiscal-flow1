import { TrendingUp, TrendingDown, Target } from 'lucide-react';

export const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'borrador': return 'bg-gray-100 text-gray-800';
    case 'aprobado': return 'bg-blue-100 text-blue-800';
    case 'en_ejecucion': return 'bg-green-100 text-green-800';
    case 'cerrado': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getVariacionIcon = (variacion: number) => {
  if (variacion > 0) return TrendingUp;
  if (variacion < 0) return TrendingDown;
  return Target;
};

export const getVariacionIconColor = (variacion: number) => {
  if (variacion > 0) return 'text-red-500';
  if (variacion < 0) return 'text-green-500';
  return 'text-blue-500';
};