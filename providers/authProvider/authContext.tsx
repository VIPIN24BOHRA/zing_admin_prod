'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User
} from 'firebase/auth';
import { app } from '@/lib/db';
import { getAuth } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<boolean>;
  setNotAllowed: any;
  notAllowed: boolean;
}

const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Google login failed:', error);
  }
};

// Function to log out
const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
};

const authenticateRider = () => {
  console.log('authenticate rider');
  fetch('/api/authenticateRider', {
    method: 'POST',
    credentials: 'include' // Important to send/receive cookies
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
};
const authenticatePidgeRider = () => {
  console.log('authenticate  pidge rider');
  fetch('/api/pidge/getToken', {
    method: 'POST',
    credentials: 'include' // Important to send/receive cookies
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);

const verifyUser = async (token: string) => {
  try {
    const res = await fetch('/api/verifyAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: process.env.NEXT_PUBLIC_WEB_API_KEY,
        token
      })
    });

    const data = await res.json();
    if (data.success) {
      console.log('Login successful!');
      return true;
    } else {
      console.log('Access denied. Only @domain.com emails are allowed.');
      return true;
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    return true;
  }
};

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notAllowed, setNotAllowed] = useState(false);
  useEffect(() => {
    console.log('Auth provider is called');

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('on auth state changed', user);

      if (user) {
        const token = await user.getIdToken();
        const res = await verifyUser(token);

        console.log(res);
        if (res) {
          setUser(user);
          authenticatePidgeRider();
        } else {
          setNotAllowed(true);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login: loginWithGoogle,
    logout,
    setNotAllowed,
    notAllowed
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
