
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: number;
  usuario: string;
  nombre: string;
  rol: string;
  empresa: string;
  permisos: string[];
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (emailOrUsuario: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const usuarios = [
    {
      id: 1,
      usuario: "admin",
      email: "admin@empresa.com",
      password: "admin123",
      nombre: "Juan Pérez",
      rol: "admin",
      empresa: "Empresa Demo SRL",
      permisos: ["*"] // Admin tiene todos los permisos
    },
    {
      id: 2,
      usuario: "contador",
      email: "contador@empresa.com",
      password: "contador123", 
      nombre: "María González",
      rol: "contador",
      empresa: "Empresa Demo SRL",
      permisos: [
        "dashboard", 
        "facturacion", 
        "clientes", 
        "productos", 
        "inventario", 
        "plan_cuentas",
        "libro_diario", 
        "balance", 
        "reportes",
        "configuracion"
      ]
    },
    {
      id: 3,
      usuario: "ventas",
      email: "ventas@empresa.com",
      password: "ventas123",
      nombre: "Carlos Mendoza", 
      rol: "ventas",
      empresa: "Empresa Demo SRL",
      permisos: [
        "dashboard", 
        "facturacion", 
        "clientes", 
        "productos", 
        "inventario"
      ]
    }
  ];

  const login = (emailOrUsuario: string, password: string) => {
    console.log('Intentando login con:', emailOrUsuario, password);
    
    const foundUser = usuarios.find(
      (u) => (u.email === emailOrUsuario || u.usuario === emailOrUsuario) && u.password === password
    );

    console.log('Usuario encontrado:', foundUser);

    if (foundUser) {
      const userToSet = {
        id: foundUser.id,
        usuario: foundUser.usuario,
        nombre: foundUser.nombre,
        rol: foundUser.rol,
        empresa: foundUser.empresa,
        permisos: foundUser.permisos
      };
      
      setIsAuthenticated(true);
      setUser(userToSet);
      console.log('Login exitoso, usuario configurado:', userToSet);
      return true;
    } else {
      setIsAuthenticated(false);
      setUser(null);
      console.log('Login fallido');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    console.log('Logout exitoso');
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    const hasAccess = user.permisos.includes(permission) || user.permisos.includes('*');
    console.log(`Verificando permiso ${permission} para usuario ${user.usuario}:`, hasAccess);
    return hasAccess;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
