import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon = ArrowRight }) => {
  return (
    <div className="flex max-w-[48rem] h-[22rem] overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-100">
      {/* Left Image Section */}
      <div className="w-2/5 shrink-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"
          alt="card display"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Content Section */}
      <div className="flex w-3/5 flex-col justify-between p-8">
        <div>
          <h6 className="mb-3 text-xs font-bold uppercase tracking-wider text-pink-500">
            {title}
          </h6>
          <h4 className="mb-3 text-2xl font-bold leading-snug text-slate-900">
            {value}
          </h4>
          <p className="text-sm font-normal leading-relaxed text-slate-600 line-clamp-4">
            Like so many organizations these days, Autodesk is a company in
            transition. It was until recently a traditional boxed software company
            selling licenses. Yet its own business model disruption is only part of
            the story.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 self-start text-xs font-bold uppercase tracking-wider text-pink-500 transition-colors hover:text-pink-600"
        >
          Learn More
          <Icon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};