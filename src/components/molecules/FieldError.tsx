import { AlertCircle } from 'lucide-react';

/** Molecule: consistent inline validation feedback. */
export function FieldError({ message }: { message: string }) {
  return <p role="alert" className="text-xs text-rose-600 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{message}</p>;
}
