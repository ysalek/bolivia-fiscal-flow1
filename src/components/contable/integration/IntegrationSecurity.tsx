import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Key, 
  Lock,
  Scan,
  FileText,
  Clock,
  Eye
} from 'lucide-react';

interface SecurityIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  integration: string;
  category: string;
  discovered: Date;
  status: 'open' | 'resolved' | 'investigating';
}

interface SecurityScan {
  id: string;
  integration: string;
  type: 'vulnerability' | 'configuration' | 'certificate' | 'permissions';
  status: 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  issues: number;
}

const IntegrationSecurity: React.FC = () => {
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([
    {
      id: '1',
      severity: 'high',
      title: 'Token de acceso cerca de expirar',
      description: 'El token de WhatsApp Business expira en 3 días',
      integration: 'whatsapp',
      category: 'authentication',
      discovered: new Date(),
      status: 'open'
    },
    {
      id: '2',
      severity: 'medium',
      title: 'Certificado SSL próximo a vencer',
      description: 'El certificado SSL de BCP expira en 15 días',
      integration: 'bcp',
      category: 'certificates',
      discovered: new Date(),
      status: 'open'
    },
    {
      id: '3',
      severity: 'low',
      title: 'Configuración de timeout recomendada',
      description: 'Se recomienda reducir el timeout de SIN a 30 segundos',
      integration: 'sin',
      category: 'configuration',
      discovered: new Date(),
      status: 'investigating'
    }
  ]);

  const [scans, setScans] = useState<SecurityScan[]>([
    {
      id: '1',
      integration: 'sin',
      type: 'vulnerability',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(),
      issues: 1
    },
    {
      id: '2',
      integration: 'bcp',
      type: 'certificate',
      status: 'running',
      progress: 65,
      startTime: new Date(Date.now() - 600000),
      issues: 0
    },
    {
      id: '3',
      integration: 'whatsapp',
      type: 'permissions',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 1800000),
      endTime: new Date(Date.now() - 300000),
      issues: 2
    }
  ]);

  const [securityScore, setSecurityScore] = useState(78);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600';
      case 'high':
        return 'bg-red-400';
      case 'medium':
        return 'bg-yellow-400';
      case 'low':
        return 'bg-blue-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <XCircle className="w-4 h-4" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'destructive';
      case 'investigating':
        return 'secondary';
      case 'resolved':
        return 'default';
      default:
        return 'outline';
    }
  };

  const runSecurityScan = (integration: string, type: string) => {
    const newScan: SecurityScan = {
      id: Date.now().toString(),
      integration,
      type: type as any,
      status: 'running',
      progress: 0,
      startTime: new Date(),
      issues: 0
    };

    setScans(prev => [...prev, newScan]);

    // Simulate scan progress
    const interval = setInterval(() => {
      setScans(prev => prev.map(scan => {
        if (scan.id === newScan.id && scan.status === 'running') {
          const newProgress = Math.min(scan.progress + Math.random() * 20, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            return {
              ...scan,
              progress: 100,
              status: 'completed',
              endTime: new Date(),
              issues: Math.floor(Math.random() * 3)
            };
          }
          return { ...scan, progress: newProgress };
        }
        return scan;
      }));
    }, 1000);
  };

  const resolveIssue = (issueId: string) => {
    setSecurityIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, status: 'resolved' } : issue
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Seguridad de Integraciones</h3>
          <p className="text-sm text-muted-foreground">
            Monitoreo y análisis de seguridad en tiempo real
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{securityScore}</div>
            <div className="text-xs text-muted-foreground">Score de Seguridad</div>
          </div>
          <Button>
            <Scan className="w-4 h-4 mr-2" />
            Escaneo Completo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="issues">Problemas</TabsTrigger>
          <TabsTrigger value="scans">Escaneos</TabsTrigger>
          <TabsTrigger value="certificates">Certificados</TabsTrigger>
          <TabsTrigger value="policies">Políticas</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          {/* Security Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Estado de Seguridad</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Puntuación General</span>
                  <span className="text-2xl font-bold">{securityScore}/100</span>
                </div>
                <Progress value={securityScore} className="h-3" />
                
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {securityIssues.filter(i => i.severity === 'critical' || i.severity === 'high').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Críticos/Altos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">
                      {securityIssues.filter(i => i.severity === 'medium').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Medios</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {securityIssues.filter(i => i.severity === 'low').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Bajos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {securityIssues.filter(i => i.status === 'resolved').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Resueltos</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues List */}
          <div className="space-y-3">
            {securityIssues.map((issue) => (
              <Card key={issue.id} className="border-l-4" style={{borderLeftColor: getSeverityColor(issue.severity).replace('bg-', '')}}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-1 rounded ${getSeverityColor(issue.severity)} text-white`}>
                        {getSeverityIcon(issue.severity)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{issue.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                        
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {issue.integration}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {issue.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {issue.discovered.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(issue.status)}>
                        {issue.status}
                      </Badge>
                      {issue.status === 'open' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => resolveIssue(issue.id)}
                        >
                          Resolver
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scans" className="space-y-4">
          {/* Quick Scan Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              onClick={() => runSecurityScan('all', 'vulnerability')}
              className="h-20 flex-col"
            >
              <Scan className="w-6 h-6 mb-2" />
              Vulnerabilidades
            </Button>
            <Button 
              variant="outline" 
              onClick={() => runSecurityScan('all', 'configuration')}
              className="h-20 flex-col"
            >
              <Shield className="w-6 h-6 mb-2" />
              Configuración
            </Button>
            <Button 
              variant="outline" 
              onClick={() => runSecurityScan('all', 'certificate')}
              className="h-20 flex-col"
            >
              <Lock className="w-6 h-6 mb-2" />
              Certificados
            </Button>
            <Button 
              variant="outline" 
              onClick={() => runSecurityScan('all', 'permissions')}
              className="h-20 flex-col"
            >
              <Key className="w-6 h-6 mb-2" />
              Permisos
            </Button>
          </div>

          {/* Scan Results */}
          <div className="space-y-3">
            {scans.map((scan) => (
              <Card key={scan.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{scan.integration}</Badge>
                        <span className="font-medium capitalize">{scan.type}</span>
                        <Badge variant={scan.status === 'completed' ? 'default' : 
                                      scan.status === 'running' ? 'secondary' : 'destructive'}>
                          {scan.status}
                        </Badge>
                      </div>
                      
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progreso: {scan.progress.toFixed(0)}%</span>
                          <span>Issues: {scan.issues}</span>
                        </div>
                        <Progress value={scan.progress} className="h-2" />
                        
                        <div className="text-xs text-muted-foreground">
                          Iniciado: {scan.startTime.toLocaleTimeString()}
                          {scan.endTime && ` • Finalizado: ${scan.endTime.toLocaleTimeString()}`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Reporte
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Certificados</CardTitle>
              <CardDescription>
                Monitoreo de certificados SSL y tokens de acceso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'BCP SSL Certificate', expires: '2024-12-15', status: 'expiring', integration: 'bcp' },
                  { name: 'WhatsApp Access Token', expires: '2024-09-01', status: 'critical', integration: 'whatsapp' },
                  { name: 'SIN API Certificate', expires: '2025-06-30', status: 'valid', integration: 'sin' }
                ].map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{cert.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Expira: {cert.expires} • {cert.integration}
                        </div>
                      </div>
                    </div>
                    <Badge variant={
                      cert.status === 'valid' ? 'default' :
                      cert.status === 'expiring' ? 'secondary' : 'destructive'
                    }>
                      {cert.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Políticas de Seguridad</CardTitle>
              <CardDescription>
                Configuración y cumplimiento de políticas de seguridad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Rotación de Tokens', status: 'enabled', description: 'Tokens se rotan cada 30 días' },
                  { name: 'Cifrado en Tránsito', status: 'enabled', description: 'TLS 1.3 requerido para todas las conexiones' },
                  { name: 'Validación de Certificados', status: 'enabled', description: 'Verificación estricta de certificados SSL' },
                  { name: 'Rate Limiting', status: 'partial', description: 'Implementado para SIN, pendiente para otros' },
                  { name: 'Logging de Seguridad', status: 'enabled', description: 'Todos los eventos de seguridad se registran' }
                ].map((policy, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{policy.name}</div>
                        <div className="text-sm text-muted-foreground">{policy.description}</div>
                      </div>
                    </div>
                    <Badge variant={
                      policy.status === 'enabled' ? 'default' :
                      policy.status === 'partial' ? 'secondary' : 'destructive'
                    }>
                      {policy.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationSecurity;