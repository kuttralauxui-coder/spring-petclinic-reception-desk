export const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE_URL || '/petclinic-api';

export const QUICK_VISIT_REASONS = [
  'Annual Vaccination',
  'Routine Checkup',
  'Dental Cleaning',
  'Injury / Limp',
  'Spay / Neuter Follow-up',
  'Skin / Allergy Consultation'
];

/**
 * ============================================================================
 * HELPER UTILITIES
 * ============================================================================
 */
export function formatPhone(digits: string | null | undefined) {
  if (!digits) return '';
  const cleaned = digits.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return digits;
}

export function calculateAge(birthDateStr: string | null | undefined) {
  if (!birthDateStr) return 'Unknown age';
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return 'Unknown age';
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  if (years < 1) {
    return months <= 1 ? '1 mo old' : `${months} mos old`;
  }
  return years === 1 ? '1 yr old' : `${years} yrs old`;
}

export function getTodayISO() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getSpeciesBadge(typeName = '') {
  const lower = typeName.toLowerCase();
  switch (lower) {
    case 'dog':
      return {
        label: 'Dog',
        emoji: '🐕',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        accent: 'bg-amber-500'
      };
    case 'cat':
      return {
        label: 'Cat',
        emoji: '🐈',
        bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        accent: 'bg-indigo-500'
      };
    case 'bird':
      return {
        label: 'Bird',
        emoji: '🦜',
        bg: 'bg-sky-50 text-sky-800 border-sky-200',
        accent: 'bg-sky-500'
      };
    case 'lizard':
      return {
        label: 'Lizard',
        emoji: '🦎',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        accent: 'bg-emerald-500'
      };
    case 'snake':
      return {
        label: 'Snake',
        emoji: '🐍',
        bg: 'bg-lime-50 text-lime-800 border-lime-200',
        accent: 'bg-lime-600'
      };
    case 'hamster':
      return {
        label: 'Hamster',
        emoji: '🐹',
        bg: 'bg-orange-50 text-orange-800 border-orange-200',
        accent: 'bg-orange-500'
      };
    default:
      return {
        label: typeName || 'Pet',
        emoji: '🐾',
        bg: 'bg-teal-50 text-teal-800 border-teal-200',
        accent: 'bg-teal-600'
      };
  }
}

