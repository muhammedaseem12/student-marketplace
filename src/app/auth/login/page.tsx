'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { GraduationCap, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setError('');
    const ok = await login(email, password);
    if (!ok) {
      setError('Sign-in failed. Check your email and password. Teacher accounts must use the Teacher Login Portal.');
      return;
    }

    const { data: authData, error: authError } = await (await import('@/lib/supabase/client')).supabase.auth.getUser();
    if (authError || !authData.user) {
      setError('Could not verify your account. Please try again.');
      return;
    }
    const appRole = authData.user.app_metadata?.role;
    const userMetadata = authData.user.user_metadata || {};
    const requestedRole = userMetadata.requested_role || userMetadata.role;
    const isTeacherAccount =
      appRole === 'teacher' ||
      appRole === 'teacher_applicant' ||
      requestedRole === 'teacher' ||
      userMetadata.teacher_access_status === 'pending';

    if (isTeacherAccount || (appRole && appRole !== 'student')) {
      const { supabase } = await import('@/lib/supabase/client');
      await supabase.auth.signOut({ scope: 'local' });
      setError(
        isTeacherAccount
          ? 'Teacher accounts cannot sign in here. Please use the Teacher Login Portal.'
          : 'This account is not marked as a student account. Please contact the administrator.'
      );
      return;
    }
    router.replace('/');
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f7fcff] via-[#eaf6ff] to-[#d9efff] px-4 py-10 text-[#10366b] sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" />

      <section className="relative w-full max-w-md rounded-[2rem] border border-white/90 bg-white/90 p-6 shadow-[0_24px_80px_rgba(30,94,153,0.14)] backdrop-blur-xl sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-200">
            <GraduationCap className="h-9 w-9" aria-hidden="true" />
          </div>
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">Student productivity platform</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[#10366b]">Studora</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Welcome back. Sign in to pick up where you left off.</p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="student-email" className="mb-2 block text-sm font-bold text-[#173d70]">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" aria-hidden="true" />
              <input
                id="student-email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-sky-200 bg-white px-4 py-3 pl-11 text-base text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="student-password" className="block text-sm font-bold text-[#173d70]">Password</label>
              <span className="text-xs text-slate-500">Need help? Contact your campus administrator.</span>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" aria-hidden="true" />
              <input
                id="student-password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-sky-200 bg-white px-4 py-3 pl-11 text-base text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Sign in <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New to Studora?{' '}
          <Link href="/auth/register" className="font-extrabold text-blue-700 hover:text-blue-900 hover:underline">Create an account</Link>
        </p>

        <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-sky-100" /><span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Faculty access</span><div className="h-px flex-1 bg-sky-100" /></div>
        <Link href="/auth/teacher-login" className="flex w-full items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold text-[#17457f] transition hover:border-sky-300 hover:bg-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          <ShieldCheck className="h-4 w-4 text-blue-600" aria-hidden="true" /> Teacher Login Portal
        </Link>
        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500"><Sparkles className="h-3.5 w-3.5 text-blue-500" /> Your academic workspace, in one place.</p>
      </section>
    </main>
  );
}
