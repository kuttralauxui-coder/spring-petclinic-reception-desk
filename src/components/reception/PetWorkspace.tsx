import { lazy, Suspense } from 'react';
import type { ReceptionDeskModel } from '../../hooks/useReceptionDesk';
import { HeartPulse } from 'lucide-react';
import { PanelLoading } from './PanelLoading';

const PetClinicalWorkspace = lazy(() => import('../organisms/PetClinicalWorkspace').then(
  ({ PetClinicalWorkspace }) => ({ default: PetClinicalWorkspace })
));

type Props = Pick<ReceptionDeskModel, 'mobilePane' | 'selectedOwner' | 'selectedPet' | 'petTypes' | 'isEditingPet'
  | 'setIsEditingPet' | 'handleUpdatePet' | 'handleLogVisit'>;

export function PetWorkspace({ mobilePane, selectedOwner, selectedPet, petTypes, isEditingPet, setIsEditingPet, handleUpdatePet, handleLogVisit }: Props) {
  return (
    <section
      className={`lg:col-span-5 ${
        mobilePane !== 'pet' ? 'hidden lg:block' : 'block'
      }`}
    >
      {selectedOwner && selectedPet ? (
        <Suspense fallback={<PanelLoading>Loading the pet chart…</PanelLoading>}>
          <PetClinicalWorkspace
            key={selectedPet.id}
            owner={selectedOwner}
            pet={selectedPet}
            petTypes={petTypes}
            isEditingPet={isEditingPet}
            onStartEditPet={() => setIsEditingPet(true)}
            onCancelEditPet={() => setIsEditingPet(false)}
            onSaveEditPet={(petForm) =>
              handleUpdatePet(selectedOwner.id, selectedPet.id, petForm)
            }
            onLogVisit={(visitForm) =>
              handleLogVisit(selectedOwner.id, selectedPet.id, visitForm)
            }
          />
        </Suspense>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-10 text-center flex flex-col items-center justify-center min-h-[420px]">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Active Pet Selected</h3>
          <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
            {selectedOwner
              ? `Select one of ${selectedOwner.firstName}'s pets or register a new pet to view medical history and log a visit.`
              : 'Choose an owner from the directory to inspect their pets and clinical visits.'}
          </p>
        </div>
      )}
    </section>
  );
}
