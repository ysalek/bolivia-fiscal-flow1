import { useAuth } from '@/components/auth/AuthProvider';
import LoginForm from '@/components/auth/LoginForm';
import { useLocation } from 'react-router-dom';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const publicPaths = ['/signup', '/web', '/suscripcion'];
  const isPublic = publicPaths.includes(location.pathname);

  if (!isAuthenticated && !isPublic) {
    return <LoginForm />;
  }

  return <>{children}</>;
};

export default AuthWrapper;