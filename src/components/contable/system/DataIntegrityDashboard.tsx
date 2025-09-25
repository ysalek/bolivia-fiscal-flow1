import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  CheckCircle, 
  Database, 
  GitBranch, 
  RefreshCw, 
  TrendingUp,
  Users,
  FileText,
  Zap
} from 'lucide-react';
import { useDataIntegrityAnalysis } from '@/hooks/useDataIntegrityAnalysis';

export const DataIntegrityDashboard = () => {
  const { report, loading, connectivity, analyzeDataIntegrity, generateConsolidationPlan } = useDataIntegrityAnalysis();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Analizando Integridad de Datos...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={33} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Revisando patrones de acceso a base de datos y detectando inconsistencias...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error en Análisis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No se pudo completar el análisis</AlertTitle>
            <AlertDescription>
              Verifica la conectividad con la base de datos y vuelve a intentar.
            </AlertDescription>
          </Alert>
          <Button onClick={analyzeDataIntegrity} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar Análisis
          </Button>
        </CardContent>
      </Card>
    );
  }

  const consolidationPlan = generateConsolidationPlan();

  return (
    <div className="space-y-6">
      {/* Header con estado general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado General</p>
                <div className="flex items-center gap-2 mt-1">
                  {getSeverityIcon(report.severityLevel)}
                  <Badge variant={report.severityLevel === 'critical' ? 'destructive' : 'secondary'}>
                    {report.severityLevel.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <Database className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tablas Analizadas</p>
                <p className="text-2xl font-bold">{report.totalTables}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accesos Duplicados</p>
                <p className="text-2xl font-bold text-orange-600">{report.duplicatedAccess.length}</p>
              </div>
              <GitBranch className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conectividad</p>
                <div className="flex items-center gap-2 mt-1">
                  {connectivity ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    {connectivity ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis detallado */}
      <Tabs defaultValue="patterns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patterns">Patrones de Acceso</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          <TabsTrigger value="plan">Plan de Consolidación</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patrones de Acceso a Base de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {report.duplicatedAccess.map((pattern, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Tabla: {pattern.tableName}</h4>
                      <Badge variant="outline">
                        {pattern.accessCount} accesos
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Hooks que acceden:</p>
                        <ul className="text-sm space-y-1">
                          {pattern.hooks.map((hook, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              {hook}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Componentes afectados:</p>
                        <ul className="text-sm space-y-1">
                          {pattern.components.map((component, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              {component}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {pattern.inconsistencies.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2 text-red-600">Inconsistencias detectadas:</p>
                        <ul className="text-sm space-y-1">
                          {pattern.inconsistencies.map((inconsistency, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                              {inconsistency}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de Mejora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.recommendedConsolidations.map((rec, index) => (
                  <Alert key={index} className={`border-l-4 ${getSeverityColor(rec.severity)}`}>
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(rec.severity)}
                      <div className="flex-1">
                        <AlertTitle className="flex items-center gap-2">
                          {rec.issue}
                          <Badge variant="outline">{rec.severity}</Badge>
                        </AlertTitle>
                        <AlertDescription className="mt-2">
                          <p className="mb-2"><strong>Solución:</strong> {rec.solution}</p>
                          <p className="mb-2"><strong>Impacto estimado:</strong> {rec.estimatedImpact}</p>
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-1">Archivos afectados:</p>
                            <div className="flex flex-wrap gap-1">
                              {rec.affectedFiles.map((file, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {file}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="space-y-4">
          {consolidationPlan && (
            <div className="space-y-4">
              {Object.entries(consolidationPlan).map(([phaseKey, phase]) => (
                <Card key={phaseKey}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {phase.title}
                      <Badge variant={phase.priority === 'critical' ? 'destructive' : 'secondary'}>
                        {phase.priority}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        <strong>Tiempo estimado:</strong> {phase.estimatedTime}
                      </p>
                      <div>
                        <p className="text-sm font-medium mb-2">Acciones requeridas:</p>
                        <ul className="space-y-1">
                          {phase.actions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Botones de acción */}
      <div className="flex gap-4">
        <Button onClick={analyzeDataIntegrity} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Re-analizar
        </Button>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          Implementar Plan de Consolidación
        </Button>
      </div>
    </div>
  );
};