'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpenCheck,
  CalendarDays,
  User,
  GraduationCap,
  UserCheck,
  FolderDown,
  ShoppingBag,
  MoreHorizontal,
  X,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const primaryItems = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'Tasks', href: '/assignments', icon: BookOpenCheck },
    { name: 'Schedule', href: '/timetable', icon: CalendarDays },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const moreItems = [
    { name: 'Academics', href: '/academics', icon: GraduationCap },
    { name: 'Attendance', href: '/attendance', icon: UserCheck },
    { name: 'Materials', href: '/materials', icon: FolderDown },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && Boolean(pathname?.startsWith(href)));

  const moreIsActive = moreItems.some((item) => isActive(item.href));

  return (
    <>
      {showMore && (
        <button
          type="button"
          aria-label="Close more navigation"
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/20"
          onClick={() => setShowMore(false)}
        />
      )}

      {showMore && (
        <div className="lg:hidden fixed bottom-[72px] right-3 z-50 w-56 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-2xl">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">MORE FEATURES</span>
            <button type="button" onClick={() => setShowMore(false)} aria-label="Close menu" className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {moreItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMore(false)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-purple-50 text-primary dark:bg-purple-950/50 dark:text-purple-300'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <nav aria-label="Mobile navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-1.5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] grid grid-cols-5 items-center">
        {primaryItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setShowMore(false)}
              aria-current={active ? 'page' : undefined}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 transition-colors ${
                active ? 'text-primary dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-tight">{item.name}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setShowMore((value) => !value)}
          aria-expanded={showMore}
          aria-label="More navigation options"
          className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 transition-colors ${
            showMore || moreIsActive ? 'text-primary dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {showMore ? <X className="w-5 h-5" /> : <MoreHorizontal className="w-5 h-5" />}
          <span className="text-[10px] leading-tight">More</span>
        </button>

        {primaryItems.slice(2).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setShowMore(false)}
              aria-current={active ? 'page' : undefined}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 transition-colors ${
                active ? 'text-primary dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
