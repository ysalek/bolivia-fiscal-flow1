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
  login: (usuario: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: () => false,
  logout: () => {},
  hasPermission: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const usuarios = [
    {
      id: 1,
      usuario: "admin",
      password: "admin123",
      nombre: "Juan Pérez",
      rol: "admin",
      empresa: "Empresa Demo SRL",
      permisos: ["*"] // Admin tiene todos los permisos
    },
    {
      id: 2,
      usuario: "contador",
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

  const login = (usuario: string, password: string) => {
    const foundUser = usuarios.find(
      (u) => u.usuario === usuario && u.password === password
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
