import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ToastMessage } from '../../types';

export function ReceptionToast({ toast }: { toast: ToastMessage }) {
  return (
    <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm motion-safe:animate-fade-in">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
          toast.type === 'warning'
            ? 'bg-amber-950 text-amber-100 border-amber-800'
            : toast.type === 'info'
            ? 'bg-slate-900 text-slate-100 border-slate-700'
            : 'bg-emerald-950 text-emerald-100 border-emerald-800'
        }`}
      >
        {toast.type === 'warning' ? (
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
