import type { ReceptionDeskModel } from '../../hooks/useReceptionDesk';
import { ReceptionDeskTemplate } from '../../templates/ReceptionDeskTemplate';
import { OwnerDirectory } from './OwnerDirectory';
import { OwnerWorkspace } from './OwnerWorkspace';
import { PetWorkspace } from './PetWorkspace';
import { ReceptionHeader } from './ReceptionHeader';
import { ReceptionNavigation } from './ReceptionNavigation';
import { ReceptionToast } from './ReceptionToast';

export function ReceptionDeskPresenter(model: ReceptionDeskModel) {
  return (
    <ReceptionDeskTemplate
      header={(
        <ReceptionHeader
          notice={model.notice}
          loadClinicData={model.loadClinicData}
          dismissStatus={model.dismissStatus}
        />
      )}
      navigation={
        <ReceptionNavigation
          mobilePane={model.mobilePane}
          setMobilePane={model.setMobilePane}
          isCreatingOwner={model.isCreatingOwner}
          ownerCount={model.filteredOwners.length}
          hasOwner={!!model.selectedOwner}
          hasPet={!!model.selectedPet}
        />
      }
      directory={(
        <OwnerDirectory
          mobilePane={model.mobilePane}
          ownerCount={model.ownerCount}
          searchQuery={model.searchQuery}
          setSearchQuery={model.setSearchQuery}
          isLoadingData={model.isLoadingData}
          filteredOwners={model.filteredOwners}
          isCreatingOwner={model.isCreatingOwner}
          selectedOwnerId={model.selectedOwnerId}
          startCreateOwner={model.startCreateOwner}
          selectOwner={model.selectOwner}
        />
      )}
      ownerWorkspace={(
        <OwnerWorkspace
          mobilePane={model.mobilePane}
          isCreatingOwner={model.isCreatingOwner}
          searchQuery={model.searchQuery}
          cancelCreateOwner={model.cancelCreateOwner}
          handleCreateOwner={model.handleCreateOwner}
          selectedOwner={model.selectedOwner}
          isEditingOwner={model.isEditingOwner}
          setIsEditingOwner={model.setIsEditingOwner}
          handleUpdateOwner={model.handleUpdateOwner}
          selectedPetId={model.selectedPetId}
          setIsAddingPet={model.setIsAddingPet}
          selectPet={model.selectPet}
          isAddingPet={model.isAddingPet}
          petTypes={model.petTypes}
          handleAddPet={model.handleAddPet}
        />
      )}
      petWorkspace={(
        <PetWorkspace
          mobilePane={model.mobilePane}
          selectedOwner={model.selectedOwner}
          selectedPet={model.selectedPet}
          petTypes={model.petTypes}
          isEditingPet={model.isEditingPet}
          setIsEditingPet={model.setIsEditingPet}
          handleUpdatePet={model.handleUpdatePet}
          handleLogVisit={model.handleLogVisit}
        />
      )}
      feedback={model.toast && <ReceptionToast toast={model.toast} />}
    />
  );
}
