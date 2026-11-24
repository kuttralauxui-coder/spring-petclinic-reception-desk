import { Button } from '../atoms/button';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { ClinicMark } from '../atoms/ClinicMark';
import type { ReceptionDeskModel } from '../../hooks/useReceptionDesk';

type Props = Pick<ReceptionDeskModel, 'notice' | 'loadClinicData' | 'dismissStatus'>;

export function ReceptionHeader({ notice, loadClinicData, dismissStatus }: Props) {
  return (
    <>
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <ClinicMark />
          <h1 className="font-bold text-lg tracking-tight">Spring PetClinic</h1>
        </div>
      </header>

      {notice && (
        <div className="bg-amber-950/90 border-t border-amber-800/70 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 max-w-[1600px] mx-auto w-full">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span role="alert" className="min-w-0 flex-1">{notice.message}</span>
            {notice.canRetryConnection && (
              <Button
                type="button"
                onClick={loadClinicData}
                className="inline-flex items-center gap-1 underline font-medium hover:text-white shrink-0"
              >
                <RefreshCw className="w-3 h-3" /> Retry connection
              </Button>
            )}
            <Button
              type="button"
              onClick={dismissStatus}
              className="p-0.5 hover:bg-amber-900 rounded"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
