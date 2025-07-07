"use client";

import { useState } from 'react';
import Link from 'next/link';
import '../../../public/Fonts/WEB/css/satoshi.css';
import AuthWrapper from '@/components/AuthWrapper';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4" style={{ fontFamily: 'Satoshi-Variable, sans-serif' }}>
        
        <Card className="w-full max-w-sm shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
          <CardHeader className="space-y-4 pb-4 pt-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                    <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4z"/>
                    <path d="M15 15h2v2h-2zm2 2h2v2h-2zm0 2h-2v2h2zm2-2v-2h2v2h-2z"/>
                  </svg>
                </div>
                <span 
                  className="text-xl text-black" 
                  style={{ fontFamily: 'Satoshi-Black', fontWeight: 900 }}
                >
                  QRLab
                </span>
              </div>
            </div>
            
            {/* Title */}
            <div className="text-center space-y-1">
              <h1 
                className="text-xl text-black" 
                style={{ fontFamily: 'Satoshi-Bold', fontWeight: 700 }}
              >
                Opprett konto
              </h1>
              <p 
                className="text-sm text-slate-500" 
                style={{ fontFamily: 'Satoshi-Regular', fontWeight: 400 }}
              >
                Registrer deg for å komme i gang
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm" style={{ fontFamily: 'Satoshi-Medium' }}>
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm" style={{ fontFamily: 'Satoshi-Medium' }}>
                {success}
              </div>
            )}

            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError('');
              setSuccess('');

              if (username.length < 3) {
                setError('Brukernavn må være minst 3 tegn');
                setLoading(false);
                return;
              }

              if (password !== confirmPassword) {
                setError('Passordene matcher ikke');
                setLoading(false);
                return;
              }

              if (password.length < 6) {
                setError('Passordet må være minst 6 tegn');
                setLoading(false);
                return;
              }

              try {
                const { supabase } = await import('@/lib/supabase');
                const { data, error } = await supabase.auth.signUp({
                  email,
                  password,
                  options: {
                    data: {
                      username: username,
                      display_name: username,
                      full_name: username
                    }
                  }
                });
                
                if (error) throw error;
                
                // Fallback: Ensure profile is created if trigger failed
                if (data.user && !data.user.email_confirmed_at) {
                  try {
                    await supabase.rpc('create_user_profile', {
                      user_id: data.user.id,
                      user_email: email,
                      user_name: username
                    });
                  } catch (profileError) {
                    console.warn('Profile creation fallback failed:', profileError);
                    // Don't throw here as the main signup succeeded
                  }
                }
                
                setSuccess('Bekreftelseslenke sendt til din e-post!');
              } catch (error: unknown) {
                console.error('Signup error:', error);
                const errorMessage = error instanceof Error ? error.message : 'Ukjent feil';
                setError(errorMessage === 'User already registered' ? 
                  'E-posten er allerede registrert' : 
                  errorMessage.includes('Database error') ? 
                  'Det oppstod en databasefeil. Prøv igjen.' : 
                  errorMessage);
              } finally {
                setLoading(false);
              }
            }}>
              
              {/* Username */}
              <div className="space-y-1">
                <Label 
                  htmlFor="username" 
                  className="text-black text-sm font-medium"
                  style={{ fontFamily: 'Satoshi-Medium', fontWeight: 500 }}
                >
                  Brukernavn
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 bg-slate-50 border-slate-200 focus:border-black focus:ring-black text-black"
                  placeholder="dittbrukernavn"
                  required
                  style={{ fontFamily: 'Satoshi-Regular', fontWeight: 400 }}
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label 
                  htmlFor="email" 
                  className="text-black text-sm font-medium"
                  style={{ fontFamily: 'Satoshi-Medium', fontWeight: 500 }}
                >
                  E-post
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 bg-slate-50 border-slate-200 focus:border-black focus:ring-black text-black"
                  placeholder="din@epost.no"
                  required
                  style={{ fontFamily: 'Satoshi-Regular', fontWeight: 400 }}
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label 
                  htmlFor="password" 
                  className="text-black text-sm font-medium"
                  style={{ fontFamily: 'Satoshi-Medium', fontWeight: 500 }}
                >
                  Passord
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 bg-slate-50 border-slate-200 focus:border-black focus:ring-black text-black"
                  placeholder="••••••••"
                  required
                  style={{ fontFamily: 'Satoshi-Regular', fontWeight: 400 }}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label 
                  htmlFor="confirmPassword" 
                  className="text-black text-sm font-medium"
                  style={{ fontFamily: 'Satoshi-Medium', fontWeight: 500 }}
                >
                  Bekreft passord
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 bg-slate-50 border-slate-200 focus:border-black focus:ring-black text-black"
                  placeholder="••••••••"
                  required
                  style={{ fontFamily: 'Satoshi-Regular', fontWeight: 400 }}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-black hover:bg-slate-800 text-white font-semibold shadow-xl"
                style={{ fontFamily: 'Satoshi-Bold', fontWeight: 700 }}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Oppretter...</span>
                  </div>
                ) : (
                  'Opprett konto'
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span 
                    className="px-2 bg-white text-slate-400"
                    style={{ fontFamily: 'Satoshi-Regular' }}
                  >
                    eller
                  </span>
                </div>
              </div>

              {/* Google Button */}
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  const { supabase } = await import('@/lib/supabase');
                  await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: { redirectTo: `${window.location.origin}/dashboard` }
                  });
                }}
                className="w-full h-10 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm"
                style={{ fontFamily: 'Satoshi-Medium', fontWeight: 500 }}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-4 space-y-2 text-center">
              <p 
                className="text-sm text-slate-500"
                style={{ fontFamily: 'Satoshi-Regular' }}
              >
                Har allerede en konto?{' '}
                <Button
                  variant="link"
                  asChild
                  className="h-auto p-0 text-black font-medium text-sm"
                  style={{ fontFamily: 'Satoshi-Medium' }}
                >
                  <Link href="/login">Logg inn</Link>
                </Button>
              </p>
              
              <Button
                variant="link"
                asChild
                className="h-auto p-0 text-slate-400 hover:text-black text-xs"
                style={{ fontFamily: 'Satoshi-Regular' }}
              >
                <Link href="/">← Tilbake til hjemmesiden</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthWrapper>
  );
} 