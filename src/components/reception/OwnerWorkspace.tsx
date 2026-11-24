import { lazy, Suspense } from 'react';
import type { ReceptionDeskModel } from '../../hooks/useReceptionDesk';
import { PanelLoading } from './PanelLoading';
import { PetRoster } from './PetRoster';

const NewOwnerCard = lazy(() => import('../organisms/NewOwnerCard').then(({ NewOwnerCard }) => ({ default: NewOwnerCard })));
const OwnerProfileCard = lazy(() => import('../organisms/OwnerProfileCard').then(({ OwnerProfileCard }) => ({ default: OwnerProfileCard })));
const AddPetInlineForm = lazy(() => import('../organisms/AddPetInlineForm').then(({ AddPetInlineForm }) => ({ default: AddPetInlineForm })));

type Props = Pick<ReceptionDeskModel, 'mobilePane' | 'isCreatingOwner' | 'searchQuery' | 'cancelCreateOwner'
  | 'handleCreateOwner' | 'selectedOwner' | 'isEditingOwner' | 'setIsEditingOwner' | 'handleUpdateOwner'
  | 'selectedPetId' | 'setIsAddingPet' | 'selectPet' | 'isAddingPet' | 'petTypes' | 'handleAddPet'>;

export function OwnerWorkspace({ mobilePane, isCreatingOwner, searchQuery, cancelCreateOwner, handleCreateOwner,
  selectedOwner, isEditingOwner, setIsEditingOwner, handleUpdateOwner, selectedPetId, setIsAddingPet,
  selectPet, isAddingPet, petTypes, handleAddPet }: Props) {
  return (
    <section
      className={`lg:col-span-4 space-y-5 ${
        mobilePane !== 'workspace' ? 'hidden lg:block' : 'block'
      }`}
    >
      {isCreatingOwner ? (
        <Suspense fallback={<PanelLoading>Loading customer intake…</PanelLoading>}>
          <NewOwnerCard
            initialNameHint={searchQuery}
            onCancel={cancelCreateOwner}
            onSave={handleCreateOwner}
          />
        </Suspense>
      ) : selectedOwner ? (
        <>
          <Suspense fallback={<PanelLoading>Loading customer profile…</PanelLoading>}>
            <OwnerProfileCard
              owner={selectedOwner}
              isEditing={isEditingOwner}
              onStartEdit={() => setIsEditingOwner(true)}
              onCancelEdit={() => setIsEditingOwner(false)}
              onSaveEdit={(updated) => handleUpdateOwner(selectedOwner.id, updated)}
            />
          </Suspense>
          <PetRoster
            selectedOwner={selectedOwner}
            selectedPetId={selectedPetId}
            onAddPet={() => setIsAddingPet(true)}
            onSelectPet={selectPet}
            intake={isAddingPet && (
              <Suspense fallback={<PanelLoading>Loading pet intake…</PanelLoading>}>
                <AddPetInlineForm
                  ownerName={`${selectedOwner.firstName} ${selectedOwner.lastName}`}
                  petTypes={petTypes}
                  onCancel={() => setIsAddingPet(false)}
                  onSave={(fields) => handleAddPet(selectedOwner.id, fields)}
                />
              </Suspense>
            )}
          />
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-500">
            Select a customer from the left directory or register a new customer.
          </p>
        </div>
      )}
    </section>
  );
}
