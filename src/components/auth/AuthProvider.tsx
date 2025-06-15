
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'contador' | 'ventas' | 'usuario';
  empresa: string;
  permisos: string[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simular usuarios para demo
  const mockUsers: { [key: string]: { password: string; user: User } } = {
    'admin@empresa.com': {
      password: 'admin123',
      user: {
        id: '1',
        nombre: 'Administrador Sistema',
        email: 'admin@empresa.com',
        rol: 'admin',
        empresa: 'Empresa Demo S.R.L.',
        permisos: ['*'] // Todos los permisos
      }
    },
    'contador@empresa.com': {
      password: 'contador123',
      user: {
        id: '2',
        nombre: 'María García',
        email: 'contador@empresa.com',
        rol: 'contador',
        empresa: 'Empresa Demo S.R.L.',
        permisos: ['contabilidad', 'reportes', 'balance', 'libro_diario', 'dashboard']
      }
    },
    'ventas@empresa.com': {
      password: 'ventas123',
      user: {
        id: '3',
        nombre: 'Carlos López',
        email: 'ventas@empresa.com',
        rol: 'ventas',
        empresa: 'Empresa Demo S.R.L.',
        permisos: ['facturacion', 'clientes', 'productos', 'dashboard']
      }
    }
  };

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error cargando usuario guardado:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simular delay de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userData = mockUsers[email];
      if (userData && userData.password === password) {
        setUser(userData.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData.user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permisos.includes('*')) return true; // Admin tiene todos los permisos
    return user.permisos.includes(permission);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
