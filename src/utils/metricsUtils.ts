// Utilidades para manejo de métricas y alertas

export interface MetricAlert {
  level: 'normal' | 'warning' | 'critical';
  message: string;
  threshold: number;
}

/**
 * Calcula el nivel de alerta basado en el porcentaje de uso
 * @param percentage - Porcentaje actual (0-100)
 * @param warningThreshold - Umbral de advertencia (por defecto 80%)
 * @param criticalThreshold - Umbral crítico (por defecto 95%)
 * @returns Objeto con información de la alerta
 */
export const calculateMetricAlert = (
  percentage: number,
  warningThreshold: number = 80,
  criticalThreshold: number = 95
): MetricAlert => {
  if (percentage >= criticalThreshold) {
    return {
      level: 'critical',
      message: 'Nivel crítico alcanzado',
      threshold: criticalThreshold
    };
  } else if (percentage >= warningThreshold) {
    return {
      level: 'warning',
      message: 'Alerta leve - Revisar recurso',
      threshold: warningThreshold
    };
  } else {
    return {
      level: 'normal',
      message: 'Funcionamiento normal',
      threshold: 0
    };
  }
};

/**
 * Obtiene el color CSS apropiado para el nivel de alerta
 */
export const getAlertColor = (level: string): string => {
  switch (level) {
    case 'critical':
      return 'text-destructive border-destructive bg-destructive/10';
    case 'warning':
      return 'text-warning border-warning bg-warning/10';
    default:
      return 'text-success border-success bg-success/10';
  }
};

/**
 * Obtiene el ícono apropiado para el nivel de alerta
 */
export const getAlertIcon = (level: string): string => {
  switch (level) {
    case 'critical':
      return 'AlertTriangle';
    case 'warning':
      return 'AlertCircle';
    default:
      return 'CheckCircle';
  }
};

/**
 * Genera alertas automáticas para métricas del sistema
 */
export const generateSystemAlerts = (metrics: Array<{name: string, value: number}>): MetricAlert[] => {
  return metrics
    .map(metric => ({
      ...metric,
      alert: calculateMetricAlert(metric.value)
    }))
    .filter(metric => metric.alert.level !== 'normal')
    .map(metric => ({
      ...metric.alert,
      message: `${metric.name}: ${metric.alert.message} (${metric.value}%)`
    }));
};

/**
 * Calcula el progreso de stock basado en stock actual y mínimo
 */
export const calculateStockProgress = (actual: number, minimo: number, maximo?: number): number => {
  if (maximo) {
    return Math.min(100, (actual / maximo) * 100);
  }
  // Si no hay máximo, usar mínimo como referencia (considerando stock óptimo como 3x el mínimo)
  const stockOptimo = minimo * 3;
  return Math.min(100, (actual / stockOptimo) * 100);
};

/**
 * Verifica si una métrica necesita atención inmediata
 */
export const needsImmediateAttention = (percentage: number): boolean => {
  const alert = calculateMetricAlert(percentage);
  return alert.level === 'critical';
};

/**
 * Verifica si una métrica necesita supervisión
 */
export const needsMonitoring = (percentage: number): boolean => {
  const alert = calculateMetricAlert(percentage);
  return alert.level === 'warning';
};