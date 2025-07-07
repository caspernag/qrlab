"use client";

import Link from "next/link";
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        
        // Get initial user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.log('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <nav className="relative z-10 flex justify-center py-6 px-6">
      <div className="flex items-center justify-between w-full max-w-6xl">
        <div className="text-2xl font-black text-slate-900 group" style={{ fontFamily: 'Satoshi-Black' }}>
          <Link 
            href="/" 
            className="flex items-center space-x-3 text-2xl font-black text-slate-900 hover:text-slate-700 transition-all duration-300 ease-in-out transform hover:scale-105" 
            style={{ fontFamily: 'Satoshi-Black' }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-slate-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:rotate-3">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                >
                  <path d="M3 11V3H11V11H3ZM5 9H9V5H5V9ZM3 21V13H11V21H3ZM5 19H9V15H5V19ZM13 3V11H21V3H13ZM19 9H15V5H19V9ZM19 13H21V15H19V13ZM13 13H15V15H13V13ZM15 15H17V17H15V15ZM17 17H19V19H17V17ZM19 19H21V21H19V19ZM17 19H19V21H17V19ZM13 17H15V19H13V17ZM13 19H15V21H13V19Z"/>
                </svg>
              </div>
              <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-slate-500 rounded-lg opacity-0 group-hover:opacity-15 blur-sm transition-opacity duration-300"></div>
            </div>
            <span className="text-slate-900">
              QRLab
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <Link 
            href="/features" 
            className="text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-md hover:bg-slate-50" 
            style={{ fontFamily: 'Satoshi-Medium' }}
          >
            Funksjoner
          </Link>
          <Link 
            href="#pricing" 
            className="text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-md hover:bg-slate-50" 
            style={{ fontFamily: 'Satoshi-Medium' }}
          >
            Priser
          </Link>
          <Link 
            href="/about" 
            className="text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-md hover:bg-slate-50" 
            style={{ fontFamily: 'Satoshi-Medium' }}
          >
            Om oss
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {loading ? (
            // Loading state
            <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
          ) : user ? (
            // Logged in user - Clean dashboard button
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 py-2 px-3 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-all duration-200"
              style={{ fontFamily: 'Satoshi-Medium' }}
            >
              <span>Dashboard</span>
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            // Not logged in
            <>
              <Button 
                asChild
                variant="ghost" 
                className="text-slate-600 hover:text-slate-900"
                style={{ fontFamily: 'Satoshi-Medium' }}
              >
                <Link href="/login">Logg inn</Link>
              </Button>
              <Button 
                asChild
                variant="default"
                style={{ fontFamily: 'Satoshi-Medium'}}
                className="hover:cursor-pointer"
              >
                <Link href="/signup">Ny Bruker</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}