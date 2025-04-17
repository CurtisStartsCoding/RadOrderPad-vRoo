/**
 * SuperAdminLayout Component
 * 
 * Layout wrapper for Super Admin pages with navigation sidebar.
 */

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

// Icons
import {
  LayoutDashboard,
  Building,
  Users,
  CreditCard,
  Brain,
  FileText,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  // Protect route - redirect if not super_admin
  React.useEffect(() => {
    if (user && user.role !== 'admin') { // Using 'admin' as a placeholder for super_admin
      router.push('/');
    }
  }, [user, router]);
  
  // If no user or not super_admin, show loading
  if (!user || user.role !== 'admin') { // Using 'admin' as a placeholder for super_admin
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/superadmin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Organizations', href: '/superadmin/organizations', icon: <Building className="h-5 w-5" /> },
    { label: 'Users', href: '/superadmin/users', icon: <Users className="h-5 w-5" /> },
    { label: 'Billing & Credits', href: '/superadmin/billing', icon: <CreditCard className="h-5 w-5" /> },
    { label: 'LLM & Validation', href: '/superadmin/validation', icon: <Brain className="h-5 w-5" /> },
    { label: 'Compliance & Audit', href: '/superadmin/compliance', icon: <FileText className="h-5 w-5" /> }
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-800 text-white">
          <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
            <span className="text-xl font-semibold">Super Admin</span>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="pt-4 mt-auto">
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation - Mobile */}
        <div className="md:hidden bg-gray-800 text-white">
          <div className="flex items-center justify-between h-16 px-4">
            <span className="text-xl font-semibold">Super Admin</span>
            <button onClick={toggleMobileMenu} className="p-1">
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
              <button
                onClick={logout}
                className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};