import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { useForm } from 'react-hook-form';
import { useId, useEffect } from 'react';
import { Check, Edit3, MapPin, Phone } from 'lucide-react';
import { formatPhone } from '../../data/petClinicData';
import type { Owner, OwnerFields } from '../../types';

type Props = {
  owner: Owner;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (fields: OwnerFields) => void | Promise<void>;
};

export function OwnerProfileCard({ owner, isEditing, onStartEdit, onCancelEdit, onSaveEdit }: Props) {
  const formId = useId();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<OwnerFields>();

  const { id, firstName, lastName, address, city, telephone } = owner;
  useEffect(() => {
    reset({ firstName, lastName, address, city, telephone });
  }, [id, firstName, lastName, address, city, telephone, isEditing, reset]);

  const error = errors.firstName?.message ?? errors.lastName?.message ?? errors.address?.message
    ?? errors.city?.message ?? errors.telephone?.message;
  const saveOwner = ({ firstName, lastName, address, city, telephone }: OwnerFields) => onSaveEdit({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    address: address.trim(),
    city: city.trim(),
    telephone: telephone.replace(/\D/g, '')
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 text-white font-bold text-sm flex items-center justify-center shadow-xs">
            {owner.firstName?.[0]}
            {owner.lastName?.[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {owner.firstName} {owner.lastName}
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                ID #{owner.id}
              </span>
            </div>
            <p className="text-xs text-slate-500">Primary Account Holder</p>
          </div>
        </div>

        {!isEditing && (
          <Button
            type="button"
            onClick={onStartEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Owner</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(saveOwner)} className="p-5 bg-slate-50/60 space-y-3">
          {error && (
            <div role="alert" className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor={formId + '-firstName'} className="block text-[11px] font-semibold text-slate-600 mb-1">
                First Name
              </label>
              <Input
                id={formId + '-firstName'}
                aria-invalid={!!errors.firstName}
                type="text"
                {...register('firstName', { validate: (value) => !!value?.trim() || "All fields are required." })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm"
              />
            </div>
            <div>
              <label htmlFor={formId + '-lastName'} className="block text-[11px] font-semibold text-slate-600 mb-1">
                Last Name
              </label>
              <Input
                id={formId + '-lastName'}
                aria-invalid={!!errors.lastName}
                type="text"
                {...register('lastName', { validate: (value) => !!value?.trim() || "All fields are required." })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor={formId + '-telephone'} className="block text-[11px] font-semibold text-slate-600 mb-1">
              Telephone (10 digits)
            </label>
            <Input
              id={formId + '-telephone'}
              aria-invalid={!!errors.telephone}
              type="tel"
              {...register('telephone', {
                validate: (value) => (value ?? '').replace(/\D/g, '').length === 10 || "Telephone must be exactly 10 digits."
              })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2">
              <label htmlFor={formId + '-address'} className="block text-[11px] font-semibold text-slate-600 mb-1">
                Address
              </label>
              <Input
                id={formId + '-address'}
                aria-invalid={!!errors.address}
                type="text"
                {...register('address', { validate: (value) => !!value?.trim() || "All fields are required." })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm"
              />
            </div>
            <div>
              <label htmlFor={formId + '-city'} className="block text-[11px] font-semibold text-slate-600 mb-1">
                City
              </label>
              <Input
                id={formId + '-city'}
                aria-invalid={!!errors.city}
                type="text"
                {...register('city', { validate: (value) => !!value?.trim() || "All fields are required." })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              onClick={onCancelEdit}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
            >
              <Check className="w-3.5 h-3.5" />
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Phone Number
              </span>
              <span className="font-semibold text-slate-800">
                {formatPhone(owner.telephone)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Residence
              </span>
              <span className="font-medium text-slate-800 block">{owner.address}</span>
              <span className="text-xs text-slate-500">{owner.city}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

