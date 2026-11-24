import { describe, expect, it } from 'vitest';
import { calculateAge, formatPhone, getSpeciesBadge } from './petClinicData';

describe('PetClinic display utilities', () => {
  it('formats a ten-digit phone number without changing the stored value', () => {
    expect(formatPhone('6085552654')).toBe('(608) 555-2654');
  });

  it('returns the original value when the phone number is not ten digits', () => {
    expect(formatPhone('12345')).toBe('12345');
  });

  it('maps known species to the existing badge presentation', () => {
    expect(getSpeciesBadge('cat').label).toBe('Cat');
    expect(getSpeciesBadge('dog').emoji).toBe('🐕');
  });

  it('provides a safe fallback for unknown species', () => {
    expect(getSpeciesBadge('ferret').label).toBe('ferret');
    expect(getSpeciesBadge('').label).toBe('Pet');
  });

  it('calculates an age for a valid birth date', () => {
    expect(calculateAge('2000-01-01')).toMatch(/yrs old/);
  });

  it('handles an empty or invalid birth date', () => {
    expect(calculateAge('')).toBe('Unknown age');
    expect(calculateAge('not-a-date')).toBe('Unknown age');
  });
});
