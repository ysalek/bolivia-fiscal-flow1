
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: number;
  usuario: string;
  nombre: string;
  rol: string;
  empresa: string;
  permisos: string[];
  email?: string;
  telefono?: string;
  nit?: string;
  ci?: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (emailOrUsuario: string, password: string) => boolean;
  register: (data: {
    nombre: string;
    email: string;
    telefono?: string;
    empresa: string;
    nitOrCI: string;
    usuario?: string;
    password: string;
  }) => { success: boolean; message?: string };
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
      console.log('Usuarios encontrados en localStorage:', JSON.parse(usuariosGuardados));
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
    
    console.log('No se encontraron usuarios, creando usuario por defecto');
    // Guardar usuarios por defecto
    localStorage.setItem('usuarios_sistema', JSON.stringify(usuariosPorDefecto));
    return usuariosPorDefecto;
  };

  const login = (emailOrUsuario: string, password: string) => {
    console.log('Intentando login con:', emailOrUsuario, password);
    
    // Recargar usuarios desde localStorage para obtener la lista más actualizada
    const usuariosActuales = getUsuarios();
    console.log('Usuarios actuales para login:', usuariosActuales);
    
    const foundUser = usuariosActuales.find(
      (u) => (u.email === emailOrUsuario || u.usuario === emailOrUsuario) && u.password === password && u.activo
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
      console.log('Login fallido - usuario no encontrado o inactivo');
      return false;
    }
  };
  const register = (data: {
    nombre: string;
    email: string;
    telefono?: string;
    empresa: string;
    nitOrCI: string;
    usuario?: string;
    password: string;
  }) => {
    try {
      const usuariosActuales = getUsuarios();
      const username = data.usuario || data.email.split('@')[0];
      const existe = usuariosActuales.some(
        (u: any) => u.email === data.email || u.usuario === username
      );
      if (existe) {
        console.warn('Registro fallido - email o usuario ya existen');
        return { success: false, message: 'Email o usuario ya registrados' };
      }
      const nuevoUsuario = {
        id: (usuariosActuales.at(-1)?.id || 0) + 1,
        usuario: username,
        email: data.email,
        password: data.password,
        nombre: data.nombre,
        rol: "user",
        empresa: data.empresa,
        permisos: [],
        activo: true,
        telefono: data.telefono,
        nit: data.nitOrCI?.length >= 7 ? data.nitOrCI : undefined,
        ci: data.nitOrCI?.length < 7 ? data.nitOrCI : undefined,
        fechaCreacion: new Date().toISOString()
      };
      const actualizados = [...usuariosActuales, nuevoUsuario];
      localStorage.setItem('usuarios_sistema', JSON.stringify(actualizados));
      console.log('Usuario registrado:', { id: nuevoUsuario.id, usuario: nuevoUsuario.usuario });
      // Auto login
      const ok = login(data.email, data.password);
      return ok ? { success: true } : { success: false, message: 'No se pudo iniciar sesión automáticamente' };
    } catch (e) {
      console.error('Error en registro:', e);
      return { success: false, message: 'Error inesperado en el registro' };
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
        register,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
