'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CheckSquare, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

export const DailyChecklist: React.FC = () => {
  const { dailyTasks, toggleDailyTask, addDailyTask, deleteDailyTask } = useApp();
  const [newTitle, setNewTitle] = useState('');

  const completedCount = dailyTasks.filter(t => t.completed).length;
  const percentage = dailyTasks.length > 0 ? Math.round((completedCount / dailyTasks.length) * 100) : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addDailyTask(newTitle.trim(), 'General');
    setNewTitle('');
  };

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="daily-checklist-title">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <CheckSquare className="h-5 w-5 shrink-0 text-emerald-500" />
          <h3 id="daily-checklist-title" className="font-heading text-base font-bold text-slate-900 dark:text-white">
            Daily Task Checklist
          </h3>
        </div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {completedCount} / {dailyTasks.length} Completed ({percentage}%)
        </span>
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" role="progressbar" aria-label="Daily tasks completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mb-4 space-y-2 pr-0 sm:max-h-56 sm:overflow-y-auto sm:pr-1">
        {dailyTasks.map((task) => (
          <div
            key={task.id}
            className={`flex min-w-0 items-start justify-between gap-2 rounded-xl border p-3 transition-colors ${
              task.completed
                ? 'bg-slate-50 text-slate-400 line-through dark:bg-slate-800/40'
                : 'bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-200'
            } border-slate-200 dark:border-slate-800`}
          >
            <button
              type="button"
              onClick={() => toggleDailyTask(task.id)}
              aria-pressed={task.completed}
              className="flex min-w-0 flex-1 items-start gap-3 text-left"
            >
              {task.completed ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              )}
              <span className="min-w-0 break-words text-sm font-medium leading-5 [overflow-wrap:anywhere]">{task.title}</span>
            </button>

            <button
              type="button"
              onClick={() => deleteDailyTask(task.id)}
              className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
              title="Delete task"
              aria-label={`Delete task: ${task.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="flex min-w-0 gap-2">
        <input
          type="text"
          placeholder="Add a new quick task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          aria-label="New task title"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </form>
    </section>
  );
};
