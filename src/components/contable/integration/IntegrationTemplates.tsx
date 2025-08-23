import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Upload, Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  integration: string;
  category: string;
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

const IntegrationTemplates: React.FC = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'sin-basic',
      name: 'SIN Configuración Básica',
      description: 'Template base para integración con SIN/SIAT',
      integration: 'sin',
      category: 'gobierno',
      config: {
        ambiente: 'prueba',
        codigoSistema: '775FA42C4A467AC1E8E7F10F22226CE5',
        nit: '',
        tokenDelegado: '',
        codigoModalidad: 1,
        codigoActividad: '',
        url: 'https://pilotosiatservicios.impuestos.gob.bo'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: true
    },
    {
      id: 'bcp-prod',
      name: 'BCP Producción',
      description: 'Configuración para ambiente de producción BCP',
      integration: 'bcp',
      category: 'bancaria',
      config: {
        ambiente: 'produccion',
        apiUrl: 'https://api.bcp.com.bo',
        clientId: '',
        clientSecret: '',
        timeout: 30000,
        retries: 3
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'whatsapp-business',
      name: 'WhatsApp Business API',
      description: 'Template para WhatsApp Business con webhook',
      integration: 'whatsapp',
      category: 'comunicacion',
      config: {
        phoneNumberId: '',
        accessToken: '',
        webhookUrl: '',
        webhookSecret: '',
        version: 'v18.0'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    integration: '',
    category: '',
    config: '{}'
  });

  const integrations = [
    { id: 'sin', name: 'SIN/SIAT' },
    { id: 'bcp', name: 'Banco BCP' },
    { id: 'whatsapp', name: 'WhatsApp Business' },
    { id: 'general', name: 'Servicio Genérico' }
  ];

  const categories = [
    { id: 'gobierno', name: 'Gobierno' },
    { id: 'bancaria', name: 'Bancaria' },
    { id: 'comunicacion', name: 'Comunicación' },
    { id: 'general', name: 'General' }
  ];

  const createTemplate = () => {
    try {
      const config = JSON.parse(newTemplate.config);
      const template: Template = {
        id: Date.now().toString(),
        name: newTemplate.name,
        description: newTemplate.description,
        integration: newTemplate.integration,
        category: newTemplate.category,
        config,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setTemplates(prev => [...prev, template]);
      setNewTemplate({ name: '', description: '', integration: '', category: '', config: '{}' });
      setIsCreateDialogOpen(false);

      toast({
        title: "Template creado",
        description: "El template se ha creado exitosamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "El JSON de configuración no es válido",
        variant: "destructive"
      });
    }
  };

  const duplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copia)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: false
    };

    setTemplates(prev => [...prev, newTemplate]);
    
    toast({
      title: "Template duplicado",
      description: "Se ha creado una copia del template"
    });
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Template eliminado",
      description: "El template se ha eliminado exitosamente"
    });
  };

  const applyTemplate = (template: Template) => {
    // Aquí aplicarías el template a la configuración actual
    console.log('Aplicando template:', template);
    toast({
      title: "Template aplicado",
      description: `Configuración de ${template.name} aplicada`
    });
  };

  const exportTemplate = (template: Template) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${template.name.toLowerCase().replace(/\s+/g, '-')}.json`);
    linkElement.click();
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      gobierno: 'bg-blue-100 text-blue-800',
      bancaria: 'bg-green-100 text-green-800',
      comunicacion: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={colors[category as keyof typeof colors] || colors.general}>
        {categories.find(c => c.id === category)?.name || category}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Templates de Configuración</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona plantillas de configuración reutilizables
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    placeholder="Nombre del template"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Integración</label>
                  <Select value={newTemplate.integration} onValueChange={(value) => setNewTemplate({...newTemplate, integration: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar integración" />
                    </SelectTrigger>
                    <SelectContent>
                      {integrations.map(integration => (
                        <SelectItem key={integration.id} value={integration.id}>
                          {integration.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Input
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  placeholder="Descripción del template"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Categoría</label>
                <Select value={newTemplate.category} onValueChange={(value) => setNewTemplate({...newTemplate, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Configuración (JSON)</label>
                <Textarea
                  value={newTemplate.config}
                  onChange={(e) => setNewTemplate({...newTemplate, config: e.target.value})}
                  placeholder='{"key": "value"}'
                  className="h-40 font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={createTemplate}>
                  Crear Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="relative">
            {template.isDefault && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  Default
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                {getCategoryBadge(template.category)}
                <Badge variant="outline" className="text-xs">
                  {integrations.find(i => i.id === template.integration)?.name}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  Creado: {template.createdAt.toLocaleDateString()}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setIsViewDialogOpen(true);
                    }}
                    className="flex-1"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Ver
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => applyTemplate(template)}
                    className="flex-1"
                  >
                    Aplicar
                  </Button>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => duplicateTemplate(template)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportTemplate(template)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  
                  {!template.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Template Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Integración</label>
                  <div className="text-sm text-muted-foreground">
                    {integrations.find(i => i.id === selectedTemplate.integration)?.name}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Categoría</label>
                  <div className="text-sm text-muted-foreground">
                    {categories.find(c => c.id === selectedTemplate.category)?.name}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <div className="text-sm text-muted-foreground">
                  {selectedTemplate.description}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Configuración</label>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-60">
                  {JSON.stringify(selectedTemplate.config, null, 2)}
                </pre>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => {
                  applyTemplate(selectedTemplate);
                  setIsViewDialogOpen(false);
                }}>
                  Aplicar Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationTemplates;