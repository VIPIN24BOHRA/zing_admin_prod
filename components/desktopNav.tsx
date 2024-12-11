'use client';
import { Alert, Snackbar } from '@mui/material';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@radix-ui/react-tooltip';
import { NavItem } from 'app/(dashboard)/nav-item';
import {
  ChefHat,
  HandPlatter,
  Home,
  LineChart,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users2
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from 'providers/authProvider/authContext';
import { useEffect, useState } from 'react';

export default function DesktopNav() {
  const { user, loading, logout, notAllowed, setNotAllowed } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      // show logout icon
      setShowLogout(true);
    } else {
      setShowLogout(false);
    }
  }, [user, loading]);

  const handleClose = (event?: React.SyntheticEvent | Event) => {
    setNotAllowed(false);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItem href="/" label="Dashboard">
          <Home className="h-5 w-5" />
        </NavItem>

        <NavItem href="/orders" label="Orders history">
          <ShoppingCart className="h-5 w-5" />
        </NavItem>

        <NavItem href="/liveOrders" label="live orders">
          <Package className="h-5 w-5" />
        </NavItem>

        <NavItem href="/customers" label="Customers">
          <Users2 className="h-5 w-5" />
        </NavItem>

        <NavItem href="#" label="Analytics">
          <LineChart className="h-5 w-5" />
        </NavItem>
        <NavItem href="/menu" label="Menu items">
          <HandPlatter className="h-5 w-5" />
        </NavItem>
        <NavItem href="/chef" label="Chef orders">
          <ChefHat className="h-5 w-5" />
        </NavItem>
        {showLogout && (
          <NavItem href="#" label="Log out">
            <LogOut
              className="h-5 w-5"
              onClick={() => {
                console.log('log out is clicked');
                logout();
              }}
            />
          </NavItem>
        )}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>

      <Snackbar open={notAllowed} autoHideDuration={4000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Access denied. You don't have the permission.
        </Alert>
      </Snackbar>
    </aside>
  );
}
