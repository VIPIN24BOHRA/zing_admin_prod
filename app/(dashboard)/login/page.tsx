'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useAuth } from 'providers/authProvider/authContext';
import { useEffect } from 'react';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/'); // Redirect to login page
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>login using admin account.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className="w-full"
            onClick={async () => {
              await login();
            }}
          >
            Sign in with google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
