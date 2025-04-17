/**
 * Super Admin Dashboard Page
 * 
 * Main dashboard for the Super Admin feature.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { SuperAdminLayout } from '../../../../../src/features/super-admin';
import {
  Building,
  Users,
  CreditCard,
  Brain,
  FileText,
  ArrowRight
} from 'lucide-react';

/**
 * Dashboard Page Component
 */
export default function DashboardPage() {
  // Dashboard cards data
  const dashboardCards = [
    {
      title: 'Organizations',
      description: 'Manage all organizations in the system',
      icon: <Building className="h-8 w-8" />,
      href: '/superadmin/organizations',
      stats: {
        label: 'Total Organizations',
        value: '42'
      }
    },
    {
      title: 'Users',
      description: 'Manage all users across the platform',
      icon: <Users className="h-8 w-8" />,
      href: '/superadmin/users',
      stats: {
        label: 'Total Users',
        value: '156'
      }
    },
    {
      title: 'Billing & Credits',
      description: 'Manage billing events and credit balances',
      icon: <CreditCard className="h-8 w-8" />,
      href: '/superadmin/billing',
      stats: {
        label: 'Pending Payments',
        value: '3'
      }
    },
    {
      title: 'LLM & Validation',
      description: 'Monitor validation performance and LLM usage',
      icon: <Brain className="h-8 w-8" />,
      href: '/superadmin/validation',
      stats: {
        label: 'Fallback Rate (24h)',
        value: '2.4%'
      }
    },
    {
      title: 'Compliance & Audit',
      description: 'Access logs and perform administrative reviews',
      icon: <FileText className="h-8 w-8" />,
      href: '/superadmin/compliance',
      stats: {
        label: 'PHI Access Events (24h)',
        value: '18'
      }
    }
  ];
  
  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <div key={index} className="flex flex-col bg-white rounded-lg border shadow-sm">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-primary/10 rounded-md">
                    {card.icon}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.description}</p>
                <div className="mt-4">
                  <div className="text-2xl font-bold">{card.stats.value}</div>
                  <p className="text-sm text-gray-500">{card.stats.label}</p>
                </div>
              </div>
              <div className="p-4 border-t">
                <Link 
                  href={card.href} 
                  className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                >
                  View {card.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Placeholder for real-time metrics */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium">System Health</h3>
            <p className="text-sm text-gray-500">Real-time system metrics and alerts</p>
            <div className="mt-4">
              <p className="text-center py-8 text-gray-500">
                Real-time metrics will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}