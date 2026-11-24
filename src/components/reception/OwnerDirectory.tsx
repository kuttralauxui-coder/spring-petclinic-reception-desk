import { Button } from '../atoms/button';
import { Input } from '../atoms/input';
import { memo } from 'react';
import { Search, UserPlus, Phone, X, ChevronRight } from 'lucide-react';
import { formatPhone, getSpeciesBadge } from '../../data/petClinicData';
import type { Owner } from '../../types';
import type { ReceptionDeskModel } from '../../hooks/useReceptionDesk';

const OwnerDirectoryRow = memo(function OwnerDirectoryRow({ owner, isSelected, onSelect }: {
  owner: Owner;
  isSelected: boolean;
  onSelect: (owner: Owner) => void;
}) {
  return (
    <Button
      type="button"
      onClick={() => onSelect(owner)}
      className={`w-full text-left px-4 py-3.5 transition-colors flex items-start justify-between gap-2 ${
        isSelected
          ? 'bg-teal-50/80 border-l-4 border-l-teal-600'
          : 'hover:bg-slate-50 border-l-4 border-l-transparent'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-900 truncate">
            {owner.firstName} {owner.lastName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{formatPhone(owner.telephone)}</span>
        </div>

        {/* Pet Pills */}
        <div className="flex flex-wrap gap-1 mt-2">
          {(owner.pets || []).length === 0 ? (
            <span className="text-[11px] text-slate-400 italic">No pets registered</span>
          ) : (
            owner.pets.map((pet) => {
              const badge = getSpeciesBadge(pet.type?.name);
              return (
                <span
                  key={pet.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-white border border-slate-200 text-slate-700 shadow-2xs"
                >
                  <span>{badge.emoji}</span>
                  <span>{pet.name}</span>
                </span>
              );
            })
          )}
        </div>
      </div>

      <ChevronRight
        className={`w-4 h-4 mt-1 shrink-0 transition-transform ${
          isSelected ? 'text-teal-600 translate-x-0.5' : 'text-slate-300'
        }`}
      />
    </Button>
  );
});

type Props = Pick<ReceptionDeskModel, 'mobilePane' | 'ownerCount' | 'searchQuery' | 'setSearchQuery'
  | 'isLoadingData' | 'filteredOwners' | 'isCreatingOwner' | 'selectedOwnerId' | 'startCreateOwner' | 'selectOwner'>;

type RowsProps = Pick<Props, 'filteredOwners' | 'selectedOwnerId' | 'selectOwner'>;

const OwnerDirectoryRows = memo(function OwnerDirectoryRows({ filteredOwners, selectedOwnerId, selectOwner }: RowsProps) {
  return filteredOwners.map((owner) => (
    <OwnerDirectoryRow
      key={owner.id}
      owner={owner}
      isSelected={owner.id === selectedOwnerId}
      onSelect={selectOwner}
    />
  ));
});

export function OwnerDirectory({ mobilePane, ownerCount, searchQuery, setSearchQuery, isLoadingData,
  filteredOwners, isCreatingOwner, selectedOwnerId, startCreateOwner, selectOwner }: Props) {
  return (
    <aside
      className={`lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col lg:h-[calc(100vh-112px)] lg:sticky lg:top-[76px] ${
        mobilePane !== 'owners' ? 'hidden lg:flex' : 'flex'
      }`}
    >
      {/* Header + New Customer Trigger */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Client Directory</h2>
            <p className="text-xs text-slate-500">
              {ownerCount} registered {ownerCount === 1 ? 'owner' : 'owners'}
            </p>
          </div>
          <Button
            type="button"
            onClick={startCreateOwner}
            disabled={isLoadingData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ New Customer</span>
          </Button>
        </div>

        {/* Instant Live Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="search"
            aria-label="Search clients by name, phone, or pet"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Name, phone, or pet name..."
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
          {searchQuery && (
            <Button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable Customer List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {isLoadingData ? (
          <div role="status" className="p-8 text-center text-sm text-slate-500">
            Loading Spring PetClinic records...
          </div>
        ) : filteredOwners.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No matching client found</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              No owner or pet matched "{searchQuery}".
            </p>
            <Button
              type="button"
              onClick={startCreateOwner}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register "{searchQuery}" as New Owner
            </Button>
          </div>
        ) : (
          <OwnerDirectoryRows
            filteredOwners={filteredOwners}
            selectedOwnerId={isCreatingOwner ? null : selectedOwnerId}
            selectOwner={selectOwner}
          />
        )}
      </div>
    </aside>
  );
}
