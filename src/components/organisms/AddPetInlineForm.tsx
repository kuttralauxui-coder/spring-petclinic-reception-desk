import { useId } from 'react';
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { useForm } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { getTodayISO } from '../../data/petClinicData';
import { FieldError } from '../molecules/FieldError';
import type { PetFields, PetType } from '../../types';

type PetFormValues = Omit<PetFields, 'typeId'> & { typeId: string };

type Props = {
  ownerName: string;
  petTypes: PetType[];
  onCancel: () => void;
  onSave: (fields: PetFields) => void | Promise<void>;
};

export function AddPetInlineForm({ ownerName, petTypes, onCancel, onSave }: Props) {
  const formId = useId();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PetFormValues>({
    defaultValues: { name: '', birthDate: getTodayISO(), typeId: String(petTypes[0]?.id ?? '') }
  });
  const error = errors.name?.message ?? errors.typeId?.message ?? errors.birthDate?.message;
  const savePet = ({ typeId, ...pet }: PetFormValues) => onSave({ ...pet, typeId: Number(typeId) });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(savePet)}
      className="p-4 bg-teal-50/70 border-b border-teal-100 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-teal-900">
          Add New Pet for {ownerName}
        </span>
        <Button
          type="button"
          aria-label="Cancel pet intake"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-700 p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {error && <FieldError message={error} />}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div>
          <label htmlFor={formId + '-name'} className="block text-[11px] font-semibold text-slate-700 mb-1">
            Pet Name *
          </label>
          <Input
            id={formId + '-name'}
            aria-invalid={!!errors.name}
            type="text"
            {...register('name', {
              validate: (value) => !!value?.trim() || "Please enter the pet’s name."
            })}
            placeholder="e.g., Bella"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
          />
        </div>

        <div>
          <label htmlFor={formId + '-typeId'} className="block text-[11px] font-semibold text-slate-700 mb-1">
            Species / Type *
          </label>
          <select
            id={formId + '-typeId'}
            aria-invalid={!!errors.typeId}
            {...register('typeId', {
              validate: (value) => petTypes.some((type) => String(type.id) === value) || "Please select a pet type."
            })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm capitalize"
          >
            {petTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={formId + '-birthDate'} className="block text-[11px] font-semibold text-slate-700 mb-1">
            Birth Date *
          </label>
          <Input
            id={formId + '-birthDate'}
            aria-invalid={!!errors.birthDate}
            type="date"
            max={getTodayISO()}
            {...register('birthDate', {
              required: 'Please select a birth date.',
              validate: (value) => value <= getTodayISO() || 'Birth date cannot be in the future.'
            })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Save Pet
        </Button>
      </div>
    </form>
  );
}

