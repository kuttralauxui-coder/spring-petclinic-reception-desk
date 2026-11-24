import { useId } from 'react';
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { useForm } from 'react-hook-form';
import { Check, UserPlus, X } from 'lucide-react';
import type { OwnerFields } from '../../types';

type Props = { initialNameHint?: string; onCancel: () => void; onSave: (fields: OwnerFields) => void | Promise<void> };

export function NewOwnerCard({ initialNameHint = '', onCancel, onSave }: Props) {
  const formId = useId();
  const parts = initialNameHint.trim().split(/\s+/);
  const guessedFirst = parts[0] && !/^\d+$/.test(parts[0]) ? parts[0] : '';
  const guessedLast = parts.length > 1 ? parts.slice(1).join(' ') : '';

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<OwnerFields>({
    defaultValues: { firstName: guessedFirst, lastName: guessedLast, address: '', city: '', telephone: '' }
  });
  const telephone = watch('telephone');
  const telephoneField = register('telephone', {
    validate: (value) => value.replace(/\D/g, '').length === 10
      || 'Spring PetClinic requires a 10-digit phone number'
  });
  const saveOwner = ({ firstName, lastName, address, city, telephone }: OwnerFields) => onSave({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    address: address.trim(),
    city: city.trim(),
    telephone: telephone.replace(/\D/g, '')
  });

  return (
    <div className="bg-white rounded-2xl border-2 border-teal-500/40 shadow-md overflow-hidden">
      <div className="px-5 py-4 bg-teal-50/70 border-b border-teal-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">New Customer Intake</h3>
            <p className="text-xs text-slate-600">POST /api/owners</p>
          </div>
        </div>
        <Button
          type="button"
          aria-label="Cancel customer intake"
          onClick={onCancel}
          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(saveOwner)} className="p-5 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={formId + '-firstName'} className="block text-xs font-semibold text-slate-700 mb-1">
              First Name *
            </label>
            <Input
              id={formId + '-firstName'}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? formId + '-firstName-error' : undefined}
              type="text"
              {...register('firstName', { validate: (value) => !!value?.trim() || "First name is required" })}
              placeholder="e.g., Sarah"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
            />
            {errors.firstName && (
              <p id={formId + '-firstName-error'} role="alert" className="text-[11px] text-rose-600 mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor={formId + '-lastName'} className="block text-xs font-semibold text-slate-700 mb-1">
              Last Name *
            </label>
            <Input
              id={formId + '-lastName'}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? formId + '-lastName-error' : undefined}
              type="text"
              {...register('lastName', { validate: (value) => !!value?.trim() || "Last name is required" })}
              placeholder="e.g., Jenkins"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
            />
            {errors.lastName && (
              <p id={formId + '-lastName-error'} role="alert" className="text-[11px] text-rose-600 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor={formId + '-telephone'} className="block text-xs font-semibold text-slate-700 mb-1">
            Telephone (10 Digits) *
          </label>
          <Input
            id={formId + '-telephone'}
            aria-invalid={!!errors.telephone}
            aria-describedby={errors.telephone ? formId + '-telephone-error' : undefined}
            type="tel"
            maxLength={14}
            {...telephoneField}
            onChange={(event) => {
              event.target.value = event.target.value.replace(/[^\d().\s-]/g, '');
              void telephoneField.onChange(event);
            }}
            placeholder="6085550199"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-teal-500"
          />
          <div className="flex items-center justify-between mt-1">
            {errors.telephone ? (
              <p id={formId + '-telephone-error'} role="alert" className="text-[11px] text-rose-600">{errors.telephone.message}</p>
            ) : (
              <span className="text-[11px] text-slate-400">
                Digits entered: {telephone.replace(/\D/g, '').length}/10
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor={formId + '-address'} className="block text-xs font-semibold text-slate-700 mb-1">
            Street Address *
          </label>
          <Input
            id={formId + '-address'}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? formId + '-address-error' : undefined}
            type="text"
            {...register('address', { validate: (value) => !!value?.trim() || "Street address is required" })}
            placeholder="e.g., 412 Meadowbrook Rd."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
          />
          {errors.address && (
            <p id={formId + '-address-error'} role="alert" className="text-[11px] text-rose-600 mt-1">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label htmlFor={formId + '-city'} className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
          <Input
            id={formId + '-city'}
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? formId + '-city-error' : undefined}
            type="text"
            {...register('city', { validate: (value) => !!value?.trim() || "City is required" })}
            placeholder="e.g., Madison"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
          />
          {errors.city && <p id={formId + '-city-error'} role="alert" className="text-[11px] text-rose-600 mt-1">{errors.city.message}</p>}
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <Button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm"
          >
            <Check className="w-4 h-4" />
            Create Customer Profile
          </Button>
        </div>
      </form>
    </div>
  );
}

