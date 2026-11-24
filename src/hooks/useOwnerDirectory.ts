import { useMemo } from 'react';
import type { Owner } from '../types';

function searchFields(owner: Owner) {
  const telephone = (owner.telephone ?? '').toLowerCase();
  return {
    owner,
    names: [
      `${owner.firstName} ${owner.lastName}`.toLowerCase(),
      `${owner.lastName} ${owner.firstName}`.toLowerCase(),
      ...(owner.pets ?? []).map((pet) => (pet.name ?? '').toLowerCase())
    ],
    telephone,
    digits: telephone.replace(/\D/g, '')
  };
}

export function useOwnerDirectory(owners: Owner[], searchQuery: string, selectedOwnerId: number | null, selectedPetId: number | null) {
  const selectedOwner = useMemo(
    () => owners.find((owner) => owner.id === selectedOwnerId) || null,
    [owners, selectedOwnerId]
  );
  const selectedPet = useMemo(() => {
    if (!selectedOwner?.pets) return null;
    return selectedOwner.pets.find((pet) => pet.id === selectedPetId) || null;
  }, [selectedOwner, selectedPetId]);
  const directory = useMemo(() => owners.map(searchFields), [owners]);
  const filteredOwners = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return owners;

    const digits = query.replace(/\D/g, '');
    const matches: Owner[] = [];
    for (const record of directory) {
      if (
        record.names.some((name) => name.includes(query))
        || record.telephone.includes(query)
        || (digits && record.digits.includes(digits))
      ) {
        matches.push(record.owner);
      }
    }
    return matches;
  }, [directory, owners, searchQuery]);
  return { selectedOwner, selectedPet, filteredOwners };
}
