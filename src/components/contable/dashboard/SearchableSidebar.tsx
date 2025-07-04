
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, LogOut, User, LucideIcon, Briefcase, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Module {
  id: string;
  label: string;
  icon: LucideIcon;
  keywords?: string[];
}

interface SearchableSidebarProps {
  modules: Module[];
  activeModule: string;
  setActiveModule: (id: string) => void;
}

const getRoleColor = (rol: string) => {
    const colors: { [key: string]: string } = {
      'admin': 'bg-destructive/10 text-destructive border-destructive/20',
      'contador': 'bg-primary/10 text-primary border-primary/20',
      'ventas': 'bg-success/10 text-success border-success/20',
      'usuario': 'bg-muted text-muted-foreground border-muted'
    };
    return colors[rol] || colors.usuario;
};

const SearchableSidebar = ({ modules, activeModule, setActiveModule }: SearchableSidebarProps) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filtrar módulos basado en la búsqueda
  const filteredModules = modules.filter(module => {
    const query = searchQuery.toLowerCase();
    return (
      module.label.toLowerCase().includes(query) ||
      (module.keywords && module.keywords.some(keyword => keyword.toLowerCase().includes(query)))
    );
  });

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  return (
    <Sidebar className="border-r-0 shadow-elevated">
      <SidebarHeader className="border-b bg-gradient-primary/5 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-kpi">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Sistema Contable</h2>
            <p className="text-xs text-muted-foreground">Bolivia v2.0</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar módulos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 100)}
            className="pl-10 pr-10 bg-background border-border/50 focus:border-primary/50 transition-colors"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted/50"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
            {searchQuery ? `Resultados (${filteredModules.length})` : 'Módulos del Sistema'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredModules.map((module) => {
                const Icon = module.icon;
                const isActive = activeModule === module.id;
                return (
                  <SidebarMenuItem key={module.id}>
                    <SidebarMenuButton 
                      onClick={() => setActiveModule(module.id)} 
                      isActive={isActive}
                      className={`
                        group relative px-3 py-2.5 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-primary/15 text-primary font-semibold shadow-sm border-l-4 border-l-primary' 
                          : 'hover:bg-accent/50 hover:shadow-card text-foreground'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                          {module.label}
                        </span>
                        {isActive && (
                          <div className="absolute right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            
            {filteredModules.length === 0 && searchQuery && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No se encontraron módulos</p>
                <p className="text-xs">Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t bg-gradient-card">
        <Card className="bg-gradient-primary/5 shadow-none border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-kpi">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">{user?.nombre}</div>
                  <Badge className={`${getRoleColor(user?.rol || '')} text-xs mt-1`}>
                    {user?.rol?.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={logout} 
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SearchableSidebar;
