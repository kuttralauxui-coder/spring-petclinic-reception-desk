import type { ReceptionDeskModel } from '../../hooks/useReceptionDesk';
import { Button } from '../atoms/button';

type Props = Pick<ReceptionDeskModel, 'mobilePane' | 'setMobilePane' | 'isCreatingOwner'> & {
  ownerCount: number;
  hasOwner: boolean;
  hasPet: boolean;
};

export function ReceptionNavigation({ mobilePane, setMobilePane, ownerCount, hasOwner, isCreatingOwner, hasPet }: Props) {
  return (
    <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 sticky top-[57px] z-20">
      <Button
        type="button"
        onClick={() => setMobilePane('owners')}
        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
          mobilePane === 'owners'
            ? 'bg-teal-600 text-white'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        1. Customers ({ownerCount})
      </Button>
      <Button
        type="button"
        onClick={() => setMobilePane('workspace')}
        disabled={!hasOwner && !isCreatingOwner}
        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 ${
          mobilePane === 'workspace'
            ? 'bg-teal-600 text-white'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        2. Owner & Pets
      </Button>
      <Button
        type="button"
        onClick={() => setMobilePane('pet')}
        disabled={!hasPet}
        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 ${
          mobilePane === 'pet'
            ? 'bg-teal-600 text-white'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        3. Pet & Visits
      </Button>
    </div>
  );
}
