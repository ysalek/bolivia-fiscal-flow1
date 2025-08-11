import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useSiteContent, SiteContent, FeatureItem } from '@/components/cms/SiteContentProvider';
import { supabase } from "@/integrations/supabase/client";
const AdminSiteEditor = () => {
  const { content, setContent } = useSiteContent();
  const { toast } = useToast();
const [form, setForm] = useState<SiteContent>(content);
  const [stripeKey, setStripeKey] = useState<string>('');

  useEffect(() => {
    document.title = 'Admin Sitio | Contabol';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Editor de contenido del sitio Contabol.');
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = window.location.href;
  }, []);

  useEffect(() => {
    const loadStripeKey = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'stripe_secret_key')
        .single();
      setStripeKey(data?.value ?? '');
    };
    loadStripeKey();
  }, []);

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const updateFeature = (id: string, patch: Partial<FeatureItem>) => {
    setForm((f) => ({
      ...f,
      features: f.features.map((ft) => (ft.id === id ? { ...ft, ...patch } : ft)),
    }));
  };

const onSave = () => {
    setContent(form);
    toast({ title: 'Contenido guardado', description: 'Los cambios fueron aplicados.' });
  };

  const saveStripe = async () => {
    const { error } = await supabase.from('app_settings').upsert({ key: 'stripe_secret_key', value: stripeKey });
    if (error) {
      toast({ title: 'Error guardando Stripe', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Stripe guardado', description: 'Clave secreta actualizada.' });
    }
  };

  return (
    <main className="p-4 container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editor del Sitio</h1>
        <p className="text-muted-foreground">Actualiza textos de la landing sin necesidad de código.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Branding y Hero</CardTitle>
            <CardDescription>Identidad y encabezado principal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre de marca</Label>
              <Input value={form.brandName} onChange={(e) => update('brandName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Nombre de producto</Label>
              <Input value={form.productName} onChange={(e) => update('productName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.heroTitle} onChange={(e) => update('heroTitle', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input value={form.heroSubtitle} onChange={(e) => update('heroSubtitle', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA primario (texto)</Label>
                <Input value={form.ctaPrimaryLabel} onChange={(e) => update('ctaPrimaryLabel', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>CTA primario (link)</Label>
                <Input value={form.ctaPrimaryHref} onChange={(e) => update('ctaPrimaryHref', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>CTA secundario (texto)</Label>
                <Input value={form.ctaSecondaryLabel} onChange={(e) => update('ctaSecondaryLabel', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>CTA secundario (link)</Label>
                <Input value={form.ctaSecondaryHref} onChange={(e) => update('ctaSecondaryHref', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Precio y plan</CardTitle>
            <CardDescription>Información de suscripción.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1">
                <Label>Precio (USD)</Label>
                <Input type="number" value={form.pricingUSD} onChange={(e) => update('pricingUSD', Number(e.target.value))} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Periodo</Label>
                <Input value={form.pricingPeriod} onChange={(e) => update('pricingPeriod', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descripción del plan</Label>
              <Input value={form.pricingDescription} onChange={(e) => update('pricingDescription', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Características</CardTitle>
          <CardDescription>Tarjetas visibles en la sección de características.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          {form.features.map((f) => (
            <div key={f.id} className="space-y-3">
              <div className="space-y-2">
                <Label>Ícono</Label>
                <Select value={f.icon} onValueChange={(v) => updateFeature(f.id, { icon: v as FeatureItem['icon'] })}>
                  <SelectTrigger><SelectValue placeholder="Elegir ícono" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ShieldCheck">ShieldCheck</SelectItem>
                    <SelectItem value="ReceiptText">ReceiptText</SelectItem>
                    <SelectItem value="BarChart3">BarChart3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={f.title} onChange={(e) => updateFeature(f.id, { title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input value={f.description} onChange={(e) => updateFeature(f.id, { description: e.target.value })} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Stripe</CardTitle>
          <CardDescription>Configura la clave secreta de Stripe (guardada en app_settings).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Stripe Secret Key</Label>
            <Input type="password" value={stripeKey} onChange={(e) => setStripeKey(e.target.value)} placeholder="sk_live_..." />
          </div>
          <div className="flex gap-3">
            <Button onClick={saveStripe}>Guardar clave</Button>
            <p className="text-sm text-muted-foreground">Solo admins pueden ver/editar este valor.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button onClick={onSave}>Guardar cambios</Button>
      </div>
    </main>
  );
};

export default AdminSiteEditor;
