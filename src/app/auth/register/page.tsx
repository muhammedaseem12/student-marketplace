'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { GraduationCap, Mail, Lock, User, BookOpen, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setError('');
    setSuccess('');
    const result = await register(email, password, name, major);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setSuccess(result.message);
    if (result.message.includes('Check your email')) return;
    router.push('/');
  };

  const inputClass = "w-full rounded-xl border border-sky-200 bg-white px-4 py-3 pl-11 text-base text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f7fcff] via-[#eaf6ff] to-[#d9efff] px-4 py-10 text-[#10366b] sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" />
      <section className="relative w-full max-w-md rounded-[2rem] border border-white/90 bg-white/90 p-6 shadow-[0_24px_80px_rgba(30,94,153,0.14)] backdrop-blur-xl sm:p-9">
        <div className="mb-7 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-200"><GraduationCap className="h-9 w-9" /></div>
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">Student productivity platform</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[#10366b]">Create your Studora account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Start organizing your academic life in one place.</p>
        </div>

        {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800">{error}</div>}
        {success && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-800">{success}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="register-name" className="mb-2 block text-sm font-bold text-[#173d70]">Full name</label>
            <div className="relative"><User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" /><input id="register-name" autoComplete="name" type="text" required placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)} className={inputClass} /></div>
          </div>
          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-bold text-[#173d70]">Email address</label>
            <div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" /><input id="register-email" autoComplete="email" type="email" required placeholder="you@college.edu" value={email} onChange={e=>setEmail(e.target.value)} className={inputClass} /></div>
          </div>
          <div>
            <label htmlFor="register-major" className="mb-2 block text-sm font-bold text-[#173d70]">Course / major <span className="font-normal text-slate-400">(optional)</span></label>
            <div className="relative"><BookOpen className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" /><input id="register-major" type="text" placeholder="e.g. B.Tech ECE" value={major} onChange={e=>setMajor(e.target.value)} className={inputClass} /></div>
          </div>
          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-bold text-[#173d70]">Password</label>
            <div className="relative"><Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" /><input id="register-password" autoComplete="new-password" type="password" minLength={8} required placeholder="At least 8 characters" value={password} onChange={e=>setPassword(e.target.value)} className={inputClass} /></div>
          </div>
          <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Create account <ArrowRight className="h-4 w-4" /></button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link href="/auth/login" className="font-extrabold text-blue-700 hover:text-blue-900 hover:underline">Sign in</Link></p>
      </section>
    </main>
  );
}
