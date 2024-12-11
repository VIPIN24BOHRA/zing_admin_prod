// components/ProtectedRoute.tsx
import { useRouter } from 'next/router';
import { useAuth } from 'providers/authProvider/authContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const noAuthRequired = ['/login', '/signup'];
  const isProtected = !noAuthRequired.includes(router.pathname);

  console.log('is protected route', router.pathname, isProtected);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login page
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p>Loading...</p>; // Or a spinner/loading component
  }

  return <>{children}</>;
};

export default ProtectedRoute;
