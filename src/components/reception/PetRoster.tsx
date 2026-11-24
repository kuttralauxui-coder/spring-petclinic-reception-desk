import { Button } from '../atoms/button';
import { Calendar, ChevronRight, PawPrint, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Owner } from '../../types';
import { calculateAge, getSpeciesBadge } from '../../data/petClinicData';

type Props = {
  selectedOwner: Owner;
  selectedPetId: number | null;
  onAddPet: () => void;
  onSelectPet: (petId: number) => void;
  intake?: ReactNode;
};

export function PetRoster({ selectedOwner, selectedPetId, onAddPet, onSelectPet, intake }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
            <PawPrint className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Registered Pets ({selectedOwner.pets?.length || 0})
            </h3>
            <p className="text-xs text-slate-500">
              Select a pet to view history or log a visit
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={onAddPet}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Pet</span>
        </Button>
      </div>

      {intake}

      {/* Pet Roster List */}
      <div className="p-4 space-y-2.5">
        {(selectedOwner.pets || []).length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-xl">
            <PawPrint className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              No pets on file for {selectedOwner.firstName}
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              Add their pet to begin logging appointments and medical visits.
            </p>
            <Button
              type="button"
              onClick={onAddPet}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              Register First Pet
            </Button>
          </div>
        ) : (
          selectedOwner.pets.map((pet) => {
            const badge = getSpeciesBadge(pet.type?.name);
            const isPetSelected = pet.id === selectedPetId;
            const visitCount = pet.visits?.length || 0;

            return (
              <Button
                key={pet.id}
                type="button"
                onClick={() => onSelectPet(pet.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isPetSelected
                    ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/15 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl shrink-0 ${badge.bg}`}
                  >
                    {badge.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 truncate">
                        {pet.name}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${badge.bg}`}
                      >
                        {pet.type?.name || 'Pet'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        DOB: {pet.birthDate} ({calculateAge(pet.birthDate)})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    {visitCount} {visitCount === 1 ? 'visit' : 'visits'}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      isPetSelected ? 'text-teal-600' : 'text-slate-400'
                    }`}
                  />
                </div>
              </Button>
            );
          })
        )}
      </div>
    </div>
  );
}
