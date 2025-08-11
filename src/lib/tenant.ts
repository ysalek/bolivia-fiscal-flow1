export function resolveTenant(): { slug: string; type: 'subdomain' | 'path' | 'none' } {
  const host = window.location.host;
  const path = window.location.pathname;

  // Prioridad a la ruta /e/:slug
  const pathMatch = path.match(/^\/e\/([^/]+)/);
  if (pathMatch) {
    return { slug: decodeURIComponent(pathMatch[1]), type: 'path' };
  }

  // Ignorar subdominios de Lovable staging
  const isLovable = /\.lovable(project|app)\.com$/.test(host);
  const isLocalhost = /localhost(:\d+)?$/.test(host);

  if (!isLovable && !isLocalhost) {
    const parts = host.split('.');
    if (parts.length > 2) {
      const sub = parts[0];
      if (sub && sub !== 'www') {
        return { slug: sub, type: 'subdomain' };
      }
    }
  }

  return { slug: 'default', type: 'none' };
}
