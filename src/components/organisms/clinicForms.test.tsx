import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { getTodayISO, QUICK_VISIT_REASONS } from '../../data/petClinicData';
import { AddPetInlineForm } from './AddPetInlineForm';
import { NewOwnerCard } from './NewOwnerCard';
import { PetClinicalWorkspace } from './PetClinicalWorkspace';

it('rejects whitespace in required owner fields and submits a normalized phone number', async () => {
  const onSave = vi.fn();
  render(<NewOwnerCard initialNameHint="Sarah Jenkins" onCancel={vi.fn()} onSave={onSave} />);
  const submit = screen.getByRole('button', { name: 'Create Customer Profile' });
  fireEvent.change(screen.getByPlaceholderText('e.g., Madison'), { target: { value: '   ' } });
  fireEvent.click(submit);
  expect(await screen.findByText('City is required')).toBeVisible();
  expect(onSave).not.toHaveBeenCalled();

  fireEvent.change(screen.getByPlaceholderText('e.g., Madison'), { target: { value: ' Madison ' } });
  fireEvent.change(screen.getByPlaceholderText('e.g., 412 Meadowbrook Rd.'), { target: { value: '1 Main St' } });
  fireEvent.change(screen.getByPlaceholderText('6085550199'), { target: { value: '(608) 555-0199' } });
  fireEvent.click(submit);
  await waitFor(() => expect(onSave).toHaveBeenCalledWith({
    firstName: 'Sarah', lastName: 'Jenkins', city: 'Madison', address: '1 Main St', telephone: '6085550199'
  }));
});

it('rejects future birth dates and saves the default pet type as a number', async () => {
  const onSave = vi.fn();
  const { container } = render(
    <AddPetInlineForm ownerName="Sarah" petTypes={[{ id: 2, name: 'dog' }]} onCancel={vi.fn()} onSave={onSave} />
  );
  const birthDate = container.querySelector('input[type="date"]')!;
  const submit = screen.getByRole('button', { name: 'Save Pet' });
  fireEvent.change(screen.getByPlaceholderText('e.g., Bella'), { target: { value: 'Bella' } });
  fireEvent.change(birthDate, { target: { value: '2999-01-01' } });
  fireEvent.click(submit);
  expect(await screen.findByText('Birth date cannot be in the future.')).toBeVisible();
  expect(onSave).not.toHaveBeenCalled();

  fireEvent.change(birthDate, { target: { value: getTodayISO() } });
  fireEvent.click(submit);
  await waitFor(() => expect(onSave).toHaveBeenCalledWith({ name: 'Bella', birthDate: getTodayISO(), typeId: 2 }));
});

it('submits a quick visit reason through the form and resets the notes', async () => {
  const onLogVisit = vi.fn();
  const reason = QUICK_VISIT_REASONS[0];
  render(<PetClinicalWorkspace
    owner={{ firstName: 'Sarah', lastName: 'Jenkins' }}
    pet={{ id: 1, name: 'Bella', birthDate: getTodayISO(), type: { id: 2, name: 'dog' } }}
    petTypes={[{ id: 2, name: 'dog' }]} isEditingPet={false}
    onStartEditPet={vi.fn()} onCancelEditPet={vi.fn()} onSaveEditPet={vi.fn()} onLogVisit={onLogVisit}
  />);
  const submit = screen.getByRole('button', { name: 'Register Visit' });
  fireEvent.click(submit);
  expect(await screen.findByText('Please enter or select a reason for this visit.')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '+ ' + reason }));
  fireEvent.click(submit);
  await waitFor(() => expect(onLogVisit).toHaveBeenCalledWith({ date: getTodayISO(), description: reason }));
  expect(screen.getByPlaceholderText('e.g., Annual booster vaccination & weight check')).toHaveValue('');
});
