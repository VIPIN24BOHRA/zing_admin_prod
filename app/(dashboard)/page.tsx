'use client';

import { useAuth } from 'providers/authProvider/authContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  return (
    <div className="text-xl font-bold flex flex-row items-center justify-center h-[80vh]">
      Welcome to zing dashboard {user && user.displayName?.toLocaleUpperCase()}
    </div>
  );
}
