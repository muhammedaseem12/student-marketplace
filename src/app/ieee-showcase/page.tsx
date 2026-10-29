import Link from 'next/link';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Layers3,
  LibraryBig,
  LockKeyhole,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: BookOpenCheck,
    title: 'Assignments, made clearer',
    description: 'Keep coursework, priorities, due dates, and progress in one focused workspace.',
    tag: 'STAY ON TRACK',
  },
  {
    icon: CalendarDays,
    title: 'One view of campus life',
    description: 'Bring timetable planning and study sessions together to make each day easier to manage.',
    tag: 'PLAN YOUR DAY',
  },
  {
    icon: ClipboardCheck,
    title: 'Attendance at a glance',
    description: 'Understand attendance percentages, target thresholds, and how many classes you may safely miss.',
    tag: 'MAKE INFORMED CHOICES',
  },
  {
    icon: LibraryBig,
    title: 'A shared learning space',
    description: 'Organize study materials and make useful learning resources easier to find.',
    tag: 'LEARN TOGETHER',
  },
  {
    icon: ShoppingBag,
    title: 'Student-to-student marketplace',
    description: 'Give campus communities a dedicated place to discover and share useful items.',
    tag: 'CAMPUS COMMUNITY',
  },
  {
    icon: MessageSquare,
    title: 'A foundation for connection',
    description: 'A student-focused platform designed to bring everyday campus tools into one experience.',
    tag: 'BUILT AROUND STUDENTS',
  },
];

const principles = [
  ['Useful by design', 'Focus on the daily problems students actually face.'],
  ['Clear and accessible', 'Readable contrast, straightforward navigation, and a responsive layout.'],
  ['Built to grow', 'A modular foundation that can be refined through student and faculty feedback.'],
];

export default function IeeeShowcasePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f3faff] text-[#102f60]">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute right-[-12rem] top-[35rem] h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-sky-100 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/ieee-showcase" className="flex items-center gap-3" aria-label="Studora home">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-heading text-xl font-extrabold tracking-tight text-[#102f60]">Studora</span>
              <span className="block text-[11px] font-semibold tracking-wide text-slate-500">STUDENT PRODUCTIVITY PLATFORM</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex" aria-label="Main navigation">
            <a href="#platform" className="transition hover:text-blue-600">Platform</a>
            <a href="#principles" className="transition hover:text-blue-600">Our approach</a>
            <a href="#next-steps" className="transition hover:text-blue-600">Next steps</a>
          </nav>
          <Link href="/auth/login" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Open portal <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.04fr_.96fr] lg:gap-16 lg:pb-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3.5 py-2 text-xs font-bold text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" /> A student-led campus technology concept
          </div>
          <h1 className="max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-[#102f60] sm:text-5xl lg:text-6xl">
            A smarter campus starts with <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">one clear space.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Studora brings the everyday student workflow into one place — coursework, schedules, attendance, study resources, and campus exchange — with a calm interface built for focus.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700">
              Explore the student portal <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#platform" className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-6 py-3.5 text-sm font-bold text-[#17457f] transition hover:border-sky-300 hover:bg-sky-50">
              See what it offers
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Mobile-friendly design</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Modular student tools</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-sky-200/80 via-blue-100/60 to-white blur-2xl" aria-hidden="true" />
          <div className="relative rounded-[1.75rem] border border-white bg-white p-4 shadow-2xl shadow-blue-900/10 sm:p-5">
            <div className="flex items-center justify-between border-b border-slate-100 px-2 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-blue-700"><GraduationCap className="h-5 w-5" /></span>
                <div><p className="text-sm font-extrabold">Student overview</p><p className="text-xs text-slate-500">Your day, at a glance</p></div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">STUDORA</span>
            </div>
            <div className="mt-4 rounded-2xl bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-50 p-5 sm:p-6">
              <p className="text-xs font-bold text-blue-700">YOUR CAMPUS WORKSPACE</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#102f60]">Make room for learning.</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">Less switching between tools. More clarity on what matters today.</p>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[['01','Assignments'],['02','Attendance'],['03','Schedule']].map(([number,label]) => (
                  <div key={label} className="rounded-xl border border-white/80 bg-white/75 p-3">
                    <p className="text-lg font-extrabold text-blue-700">{number}</p>
                    <p className="mt-1 text-[10px] font-semibold leading-4 text-slate-600 sm:text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-sky-100 bg-[#f8fcff] p-4">
                <div className="flex items-center gap-2 text-blue-700"><CalendarDays className="h-4 w-4" /><span className="text-xs font-bold">Plan your week</span></div>
                <div className="mt-3 space-y-2"><div className="h-2 w-full rounded-full bg-sky-100"/><div className="h-2 w-4/5 rounded-full bg-sky-100"/><div className="h-2 w-3/5 rounded-full bg-sky-100"/></div>
              </div>
              <div className="rounded-xl border border-sky-100 bg-[#f8fcff] p-4">
                <div className="flex items-center gap-2 text-emerald-700"><Zap className="h-4 w-4" /><span className="text-xs font-bold">Stay organised</span></div>
                <p className="mt-3 text-xs leading-5 text-slate-500">A clear view of tasks, resources, and priorities.</p>
              </div>
            </div>
            <p className="px-1 pt-3 text-[10px] leading-4 text-slate-400">Concept preview for presentation. Dashboard metrics and feature availability depend on account and backend setup.</p>
          </div>
        </div>
      </section>

      <section id="platform" className="relative z-10 border-y border-sky-100 bg-white/80 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">The platform</p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-[#102f60] sm:text-4xl">The essentials of student life, connected.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">A single, approachable starting point for the routines that keep students moving forward.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return <article key={feature.title} className="group rounded-2xl border border-sky-100 bg-[#f8fcff] p-6 transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white"><Icon className="h-5 w-5" /></div>
                <p className="mt-5 text-[10px] font-extrabold tracking-[0.14em] text-blue-600">{feature.tag}</p>
                <h3 className="mt-2 text-lg font-extrabold text-[#153b70]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>;
            })}
          </div>
        </div>
      </section>

      <section id="principles" className="relative z-10 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">Product principles</p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-[#102f60] sm:text-4xl">Technology should make campus life simpler.</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">Studora is being developed around practical student needs, with a focus on usability today and room for feedback tomorrow.</p>
          </div>
          <div className="space-y-3">
            {principles.map(([title, description], index) => <div key={title} className="flex gap-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm shadow-blue-900/[0.02] sm:p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-extrabold text-blue-700">0{index + 1}</span>
              <div><h3 className="font-extrabold text-[#153b70]">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{description}</p></div>
            </div>)}
          </div>
        </div>
      </section>

      <section id="next-steps" className="relative z-10 px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0e3977] via-[#1257a5] to-[#1683e8] p-8 text-white shadow-xl shadow-blue-900/15 sm:p-12 lg:p-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-sky-100"><Users className="h-4 w-4" /> Built for feedback and iteration</div>
              <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Let’s shape a better student experience.</h2>
              <p className="mt-4 text-sm leading-7 text-blue-50 sm:text-base">The next step is to review the prototype with students and faculty, validate the highest-value workflows, and prioritise improvements based on real campus needs.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-800 transition hover:bg-sky-50">Open portal <ArrowRight className="h-4 w-4" /></Link>
              <a href="https://github.com/muhammedaseem12/student-marketplace" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"><Layers3 className="h-4 w-4" /> View source code</a>
            </div>
          </div>
          <div className="mt-8 border-t border-white/20 pt-5 text-xs leading-5 text-blue-100">
            Studora is an independent student project. This presentation page does not imply IEEE sponsorship, approval, or endorsement. Features should be demonstrated live and verified before being presented as production-ready.
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-sky-100 bg-white px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p><span className="font-extrabold text-[#153b70]">Studora</span> · A student productivity platform concept</p>
          <p>Designed for clarity. Built to keep improving.</p>
        </div>
      </footer>
    </main>
  );
}
