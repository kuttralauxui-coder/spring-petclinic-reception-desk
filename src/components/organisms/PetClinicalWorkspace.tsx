import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { useId, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Activity, Calendar, Check, Clock, Edit3, FileText, Plus } from 'lucide-react';
import { calculateAge, getTodayISO, getSpeciesBadge, QUICK_VISIT_REASONS } from '../../data/petClinicData';
import { FieldError } from '../molecules/FieldError';
import type { Owner, Pet, PetFields, PetType, VisitFields } from '../../types';

type PetFormValues = Omit<PetFields, 'typeId'> & { typeId: string };
type Props = {
  owner: Pick<Owner, 'firstName' | 'lastName'>;
  pet: Omit<Pet, 'ownerId' | 'visits'> & Partial<Pick<Pet, 'visits'>>;
  petTypes: PetType[];
  isEditingPet: boolean;
  onStartEditPet: () => void;
  onCancelEditPet: () => void;
  onSaveEditPet: (fields: PetFields) => void | Promise<void>;
  onLogVisit: (fields: VisitFields) => boolean | void | Promise<boolean | void>;
};

export function PetClinicalWorkspace({
  owner,
  pet,
  petTypes,
  isEditingPet,
  onStartEditPet,
  onCancelEditPet,
  onSaveEditPet,
  onLogVisit
}: Props) {
  const formId = useId();
  const {
    register: registerPet, handleSubmit: submitPet, reset: resetPet,
    formState: { errors: petErrors, isSubmitting: isSavingPet }
  } = useForm<PetFormValues>();
  const {
    register: registerVisit, handleSubmit: submitVisit, reset: resetVisit,
    getValues, setValue, clearErrors, formState: { errors: visitErrors, isSubmitting: isSavingVisit }
  } = useForm<VisitFields>({ defaultValues: { date: getTodayISO(), description: '' } });

  const { id, name, birthDate } = pet;
  const typeId = pet.type?.id;
  useEffect(() => {
    resetPet({ name, birthDate, typeId: String(typeId ?? '') });
  }, [id, name, birthDate, typeId, isEditingPet, resetPet]);

  const badge = getSpeciesBadge(pet.type?.name);

  // Sort visits reverse-chronologically (most recent first)
  const sortedVisits = useMemo(() => {
    return [...(pet.visits || [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [pet.visits]);

  const petError = petErrors.name?.message ?? petErrors.typeId?.message ?? petErrors.birthDate?.message;
  const visitError = visitErrors.date?.message ?? visitErrors.description?.message;

  const savePet = ({ typeId, ...values }: PetFormValues) => onSaveEditPet({ ...values, typeId: Number(typeId) });
  const saveVisit = async (visit: VisitFields) => {
    if (await onLogVisit(visit) !== false) {
      resetVisit({ date: getTodayISO(), description: '' });
    }
  };

  const applyQuickReason = (reason: string) => {
    const description = getValues('description');
    if (!description.trim()) {
      setValue('description', reason, { shouldDirty: true });
    } else if (!description.includes(reason)) {
      setValue('description', description.trim() + ' — ' + reason, { shouldDirty: true });
    }
    clearErrors('description');
  };

  return (
    <div className="space-y-5">
      {/* 1. Pet Header & Inline Edit Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-3xl shadow-2xs ${badge.bg}`}
            >
              {badge.emoji}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{pet.name}</h2>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${badge.bg}`}
                >
                  {pet.type?.name || 'Pet'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">Pet #{pet.id}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Owner:{' '}
                <span className="font-semibold text-slate-700">
                  {owner.firstName} {owner.lastName}
                </span>{' '}
                • Born <span className="font-medium text-slate-700">{pet.birthDate}</span> (
                {calculateAge(pet.birthDate)})
              </p>
            </div>
          </div>

          {!isEditingPet && (
            <Button
              type="button"
              onClick={onStartEditPet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Pet</span>
            </Button>
          )}
        </div>

        {isEditingPet && (
          <form noValidate onSubmit={submitPet(savePet)} className="p-5 bg-slate-50 space-y-3">
            {petError && <FieldError message={petError} />}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label htmlFor={formId + '-name'} className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Pet Name
                </label>
                <Input
                  id={formId + '-name'}
                  aria-invalid={!!petErrors.name}
                  type="text"
                  {...registerPet('name', {
                    validate: (value) => !!value?.trim() || "Please enter the pet’s name."
                  })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label htmlFor={formId + '-typeId'} className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Species
                </label>
                <select
                  id={formId + '-typeId'}
                  aria-invalid={!!petErrors.typeId}
                  {...registerPet('typeId', {
                    validate: (value) => petTypes.some((type) => String(type.id) === value) || "Please select a pet type."
                  })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm capitalize"
                >
                  {petTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={formId + '-birthDate'} className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Birth Date
                </label>
                <Input
                  id={formId + '-birthDate'}
                  aria-invalid={!!petErrors.birthDate}
                  type="date"
                  max={getTodayISO()}
                  {...registerPet('birthDate', {
                    required: 'Please select a birth date.',
                    validate: (value) => value <= getTodayISO() || 'Birth date cannot be in the future.'
                  })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                onClick={onCancelEditPet}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/70"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSavingPet}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
              >
                <Check className="w-3.5 h-3.5" />
                Save Pet Details
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Prominent Quick-Entry "Log New Visit" Card */}
      <div className="bg-white rounded-2xl border-2 border-teal-600/25 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-200" />
            <h3 className="text-sm font-bold">Log New Clinical Visit for {pet.name}</h3>
          </div>
          <span className="text-[11px] font-mono text-teal-100 bg-teal-700/70 px-2 py-0.5 rounded">
            POST /visits
          </span>
        </div>

        <form onSubmit={submitVisit(saveVisit)} className="p-5 space-y-3.5">
          {/* Quick-Select Common Reasons */}
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              One-Tap Visit Templates
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_VISIT_REASONS.map((reason) => (
                <Button
                  key={reason}
                  type="button"
                  disabled={isSavingVisit}
                  onClick={() => applyQuickReason(reason)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200/80 hover:border-teal-300 transition-colors"
                >
                  + {reason}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={formId + '-date'} className="block text-xs font-semibold text-slate-700 mb-1">
                Visit Date *
              </label>
              <Input
                id={formId + '-date'}
                aria-invalid={!!visitErrors.date}
                type="date"
                readOnly={isSavingVisit}
                {...registerVisit('date', { required: 'Please select a visit date.' })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={formId + '-description'} className="block text-xs font-semibold text-slate-700 mb-1">
                Reason / Reception Notes *
              </label>
              <Input
                id={formId + '-description'}
                aria-invalid={!!visitErrors.description}
                type="text"
                readOnly={isSavingVisit}
                {...registerVisit('description', {
                  validate: (value) => !!value?.trim() || "Please enter or select a reason for this visit."
                })}
                placeholder="e.g., Annual booster vaccination & weight check"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {visitError && <FieldError message={visitError} />}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Recorded immediately to {pet.name}'s chart
            </span>
            <Button
              type="submit"
              disabled={isSavingVisit}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Register Visit
            </Button>
          </div>
        </form>
      </div>

      {/* 3. Chronological Visit History */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Previous Visits ({sortedVisits.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Newest first</span>
        </div>

        <div className="p-5">
          {sortedVisits.length === 0 ? (
            <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FileText className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">
                No previous visits logged for {pet.name}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Use the form above to register today's appointment.
              </p>
            </div>
          ) : (
            <ol className="relative border-l-2 border-teal-100 ml-2.5 space-y-4">
              {sortedVisits.map((visit, idx) => (
                <li key={visit.id || idx} className="pl-5 relative">
                  <span
                    className={`w-3 h-3 rounded-full absolute -left-[7px] top-1.5 ring-4 ring-white ${
                      idx === 0 ? 'bg-teal-600' : 'bg-slate-300'
                    }`}
                  />
                  <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-3 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        {visit.date}
                      </span>
                      {idx === 0 && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 leading-snug">{visit.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
