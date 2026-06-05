"use client";

import { TeamBox } from "./TeamBox";

interface DivisionLayoutProps {
  divisionId: 1 | 2;
  teamIds: number[];
}

export function DivisionLayout({ divisionId, teamIds }: DivisionLayoutProps) {
  return (
    <div className="bg-slate-100/60 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl backdrop-blur-md shadow-sm">
      <h2 className="text-sm font-extrabold text-slate-500 dark:text-slate-300 mb-4 tracking-widest uppercase">
        Division {divisionId}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {teamIds.map((teamId) => (
          <TeamBox key={teamId} teamId={teamId} divisionId={divisionId} />
        ))}
      </div>
    </div>
  );
}
