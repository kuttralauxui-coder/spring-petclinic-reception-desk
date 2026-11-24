import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useOwnerDirectory } from './useOwnerDirectory';
import type { Owner } from '../types';

const owners: Owner[] = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Coleman',
    address: '105 Lake Street',
    city: 'Monona',
    telephone: '6085552654',
    pets: [
      {
        id: 7,
        ownerId: 1,
        name: 'Samantha',
        birthDate: '2022-09-04',
        type: { id: 1, name: 'cat' },
        visits: [],
      },
    ],
  },
  {
    id: 2,
    firstName: 'George',
    lastName: 'Franklin',
    address: '110 Liberty Street',
    city: 'Madison',
    telephone: '6085551023',
    pets: [],
  },
];

describe('useOwnerDirectory', () => {
  it('filters owners by first name, phone, and pet name', () => {
    const byName = renderHook(() => useOwnerDirectory(owners, 'jean', 1, 7));
    expect(byName.result.current.filteredOwners).toHaveLength(1);
    expect(byName.result.current.filteredOwners[0].id).toBe(1);

    const byPhone = renderHook(() => useOwnerDirectory(owners, '6085551023', null, null));
    expect(byPhone.result.current.filteredOwners[0].id).toBe(2);

    const byPet = renderHook(() => useOwnerDirectory(owners, 'samantha', null, null));
    expect(byPet.result.current.filteredOwners[0].id).toBe(1);
  });

  it('returns selected owner and pet records', () => {
    const { result } = renderHook(() => useOwnerDirectory(owners, '', 1, 7));
    expect(result.current.selectedOwner?.lastName).toBe('Coleman');
    expect(result.current.selectedPet?.name).toBe('Samantha');
  });

  it('finds formatted telephone numbers and reverse-order names', () => {
    const directory = [{ ...owners[0], telephone: '(608) 555-2654' }, owners[1]];
    const { result, rerender } = renderHook(({ query }) => useOwnerDirectory(directory, query, null, null), {
      initialProps: { query: '555-2654' }
    });
    expect(result.current.filteredOwners).toEqual([directory[0]]);
    rerender({ query: ' Coleman Jean ' });
    expect(result.current.filteredOwners).toEqual([directory[0]]);
  });

  it('returns null when the selected owner or pet does not exist', () => {
    const { result } = renderHook(() => useOwnerDirectory(owners, '', 99, 999));
    expect(result.current.selectedOwner).toBeNull();
    expect(result.current.selectedPet).toBeNull();
  });
});
