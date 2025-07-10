
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

  // Cargar usuarios desde localStorage o usar administrador por defecto
  const getUsuarios = () => {
    const usuariosGuardados = localStorage.getItem('usuarios_sistema');
    if (usuariosGuardados) {
      return JSON.parse(usuariosGuardados);
    }
    
    // Usuario administrador por defecto para sistema de producción
    const usuariosPorDefecto = [
      {
        id: 1,
        usuario: "admin",
        email: "admin@sistema.com",
        password: "C123081a!",
        nombre: "Administrador del Sistema",
        rol: "admin",
        empresa: "Sistema Contable",
        permisos: ["*"], // Admin tiene todos los permisos
        activo: true,
        fechaCreacion: new Date().toISOString()
      }
    ];
    
    // Guardar usuarios por defecto
    localStorage.setItem('usuarios_sistema', JSON.stringify(usuariosPorDefecto));
    return usuariosPorDefecto;
  };
  
  const [usuarios] = useState(getUsuarios());

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
