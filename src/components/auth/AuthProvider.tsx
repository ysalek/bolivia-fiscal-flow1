
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
        "reportes"
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
    const foundUser = usuarios.find(
      (u) => (u.email === emailOrUsuario || u.usuario === emailOrUsuario) && u.password === password
    );

    if (foundUser) {
      setIsAuthenticated(true);
      setUser(foundUser);
      return true;
    } else {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permisos.includes(permission) || user.permisos.includes('*');
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
