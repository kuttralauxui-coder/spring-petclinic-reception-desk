import { Stethoscope } from 'lucide-react';

export function ClinicMark() {
  return (
    <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 text-slate-950 shadow-inner">
      <Stethoscope className="size-5" />
    </span>
  );
}
