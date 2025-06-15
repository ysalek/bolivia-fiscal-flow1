
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
import { Settings, LogOut, User, LucideIcon, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Module {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface AppSidebarProps {
  modules: Module[];
  activeModule: string;
  setActiveModule: (id: string) => void;
}

const getRoleColor = (rol: string) => {
    const colors: { [key: string]: string } = {
      'admin': 'bg-red-100 text-red-800 border-red-200',
      'contador': 'bg-blue-100 text-blue-800 border-blue-200',
      'ventas': 'bg-green-100 text-green-800 border-green-200',
      'usuario': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[rol] || colors.usuario;
};

const AppSidebar = ({ modules, activeModule, setActiveModule }: AppSidebarProps) => {
  const { user, logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-sidebar-primary-foreground">Sistema Contable</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                    <SidebarMenuItem key={module.id}>
                        <SidebarMenuButton 
                            onClick={() => setActiveModule(module.id)} 
                            isActive={activeModule === module.id}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{module.label}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
         <Card className="bg-sidebar-accent shadow-none border-sidebar-border">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-sidebar-primary-foreground">{user?.nombre}</div>
                      <Badge className={`${getRoleColor(user?.rol || '')} text-xs mt-1`}>
                        {user?.rol?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-primary/10">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={logout} className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-primary/10">
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

export default AppSidebar;
