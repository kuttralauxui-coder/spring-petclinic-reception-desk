import { useCallback, useDeferredValue, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { ownersApi } from '../services/ownersApi';
import { petsApi } from '../services/petsApi';
import { visitsApi } from '../services/visitsApi';
import type { Owner, OwnerFields, Pet, PetFields, PetType, ToastMessage, VisitFields } from '../types';
import { useOwnerDirectory } from './useOwnerDirectory';
import { useToast } from './useToast';

type MobilePane = 'owners' | 'workspace' | 'pet';

type DeskNotice = { message: string; canRetryConnection?: boolean };

function errorMessage(error: unknown, saving = false) {
  if (error instanceof Error) return error.message;
  const status = error && typeof error === 'object' && 'status' in error ? error.status : undefined;
  switch (status) {
    case 400:
    case 422:
      return 'Check the form values and try again.';
    case 401:
    case 403:
      return 'You do not have access to this operation.';
    case 404:
      return 'The requested resource is unavailable.';
    case 409:
      return 'The changes conflict with an existing record.';
    case 'TIMEOUT':
      return saving
        ? 'The request timed out. Confirm whether the change was saved before submitting again.'
        : 'The request timed out.';
    case 'NETWORK':
      return saving
        ? 'The connection failed. Confirm whether the change was saved before submitting again.'
        : 'The clinic server could not be reached.';
    default:
      return 'The clinic server could not complete the request.';
  }
}

export function useReceptionDesk() {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);
  const loading = useRef(false);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [notice, setNotice] = useState<DeskNotice | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { notify } = useToast(toast, setToast);

  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const activeSelection = useRef<{ ownerId: number | null; petId: number | null }>({
    ownerId: null, petId: null
  });
  const [mobilePane, setMobilePane] = useState<MobilePane>('owners');
  const [isCreatingOwner, setIsCreatingOwner] = useState(false);
  const [isEditingOwner, setIsEditingOwner] = useState(false);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [isEditingPet, setIsEditingPet] = useState(false);

  const { selectedOwner, selectedPet, filteredOwners } = useOwnerDirectory(
    owners, deferredSearch, selectedOwnerId, selectedPetId
  );

  const selectRecords = useCallback((ownerId: number | null, petId: number | null) => {
    activeSelection.current = { ownerId, petId };
    setSelectedOwnerId(ownerId);
    setSelectedPetId(petId);
  }, []);

  const loadClinicData = useCallback(async () => {
    if (loading.current) return;
    loading.current = true;
    setIsLoadingData(true);
    setNotice(null);

    try {
      const options = { subscribe: false, forceRefetch: true };
      const [ownerResults, typeResults] = await Promise.all([
        dispatch(ownersApi.endpoints.getOwners.initiate(undefined, options)).unwrap(),
        dispatch(petsApi.endpoints.getPetTypes.initiate(undefined, options)).unwrap()
      ]);
      if (!Array.isArray(ownerResults) || !Array.isArray(typeResults)) {
        throw new Error('Expected owner and pet type lists.');
      }
      setOwners(ownerResults);
      setPetTypes(typeResults);
      const currentOwner = ownerResults.find((owner) => owner.id === activeSelection.current.ownerId);
      const nextOwner = currentOwner ?? ownerResults[0];
      const currentPet = currentOwner?.pets?.find((pet) => pet.id === activeSelection.current.petId);
      selectRecords(nextOwner?.id ?? null, currentPet?.id ?? nextOwner?.pets?.[0]?.id ?? null);
      notify(`Connected to Spring PetClinic REST (${ownerResults.length} owners loaded)`);
    } catch (error) {
      setNotice({ message: `Could not load clinic data. ${errorMessage(error)}`, canRetryConnection: true });
      notify('Backend connection failed. Check that Spring PetClinic is running.', 'warning');
    } finally {
      loading.current = false;
      setIsLoadingData(false);
    }
  }, [dispatch, notify, selectRecords]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    void loadClinicData();
  }, [loadClinicData]);

  const dismissStatus = useCallback(() => setNotice(null), []);
  const startCreateOwner = useCallback(() => {
    setIsCreatingOwner(true);
    setIsEditingOwner(false);
    setMobilePane('workspace');
  }, []);

  const cancelCreateOwner = useCallback(() => {
    setIsCreatingOwner(false);
    setMobilePane('owners');
  }, []);

  const selectOwner = useCallback((owner: Owner) => {
    setIsCreatingOwner(false);
    setIsEditingOwner(false);
    setIsEditingPet(false);
    setIsAddingPet(false);
    selectRecords(owner.id, owner.pets?.[0]?.id ?? null);
    setMobilePane('workspace');
  }, [selectRecords]);

  const selectPet = useCallback((petId: number) => {
    selectRecords(activeSelection.current.ownerId, petId);
    setIsEditingPet(false);
    setMobilePane('pet');
  }, [selectRecords]);

  async function save<T>(operation: string, request: () => Promise<T>) {
    setNotice(null);
    try {
      const data = await request();
      return { data };
    } catch (error) {
      setNotice({ message: `Could not ${operation}. ${errorMessage(error, true)}` });
      notify(`Could not ${operation}.`, 'warning');
      return null;
    }
  }

  function updateOwnerRecord(ownerId: number, update: (owner: Owner) => Owner) {
    setOwners((current) => current.map((owner) => owner.id === ownerId ? update(owner) : owner));
  }

  function updatePetRecord(ownerId: number, petId: number, update: (pet: Pet) => Pet) {
    updateOwnerRecord(ownerId, (owner) => ({
      ...owner,
      pets: (owner.pets ?? []).map((pet) => pet.id === petId ? update(pet) : pet)
    }));
  }

  function resolvePetDetails({ name, birthDate, typeId }: PetFields) {
    const type = petTypes.find((item) => item.id === typeId);
    if (!type) throw new Error('Please select an available pet type.');
    return { name: name.trim(), birthDate, type };
  }

  async function handleCreateOwner(fields: OwnerFields) {
    const result = await save('register the customer', async () => {
      const owner = await dispatch(ownersApi.endpoints.createOwner.initiate(fields, { track: false })).unwrap();
      if (!owner?.id) throw new Error('The response did not include an owner ID.');
      return owner;
    });
    if (!result) return;

    const owner = result.data;
    setOwners((current) => [owner, ...current]);
    selectOwner(owner);
    notify(`Registered new customer: ${owner.firstName} ${owner.lastName}`);
  }

  async function handleUpdateOwner(ownerId: number, fields: OwnerFields) {
    const result = await save('update the customer profile', () =>
      dispatch(ownersApi.endpoints.updateOwner.initiate({ ownerId, fields }, { track: false })).unwrap()
    );
    if (!result) return;

    updateOwnerRecord(ownerId, (owner) => ({ ...owner, ...fields }));
    if (activeSelection.current.ownerId === ownerId) setIsEditingOwner(false);
    notify('Customer profile updated');
  }

  async function handleAddPet(ownerId: number, fields: PetFields) {
    const result = await save('register the pet', async () => {
      const details = resolvePetDetails(fields);
      const pet = await dispatch(petsApi.endpoints.createPet.initiate({ ownerId, details }, { track: false })).unwrap();
      if (!pet?.id) throw new Error('The response did not include a pet ID.');
      return pet;
    });
    if (!result) return;

    const pet = result.data;
    updateOwnerRecord(ownerId, (owner) => ({
      ...owner,
      pets: [...(owner.pets ?? []), { ...pet, visits: pet.visits ?? [] }]
    }));
    if (activeSelection.current.ownerId === ownerId) {
      setIsAddingPet(false);
      selectPet(pet.id);
    }
    notify(`Added ${pet.name} to the profile`);
  }

  async function handleUpdatePet(ownerId: number, petId: number, fields: PetFields) {
    const result = await save('update the pet details', async () => {
      const details = resolvePetDetails(fields);
      await dispatch(petsApi.endpoints.updatePet.initiate({ ownerId, petId, details }, { track: false })).unwrap();
      return details;
    });
    if (!result) return;

    updatePetRecord(ownerId, petId, (pet) => ({ ...pet, ...result.data }));
    if (activeSelection.current.ownerId === ownerId && activeSelection.current.petId === petId) {
      setIsEditingPet(false);
    }
    notify(`Updated ${result.data.name}'s clinical details`);
  }

  async function handleLogVisit(ownerId: number, petId: number, fields: VisitFields) {
    const result = await save('register the visit', async () => {
      const visit = await dispatch(visitsApi.endpoints.createVisit.initiate({
        ownerId, petId, fields: { ...fields, description: fields.description.trim() }
      }, { track: false })).unwrap();
      if (!visit?.id) throw new Error('The response did not include a visit ID.');
      return visit;
    });
    if (!result) return false;

    updatePetRecord(ownerId, petId, (pet) => ({ ...pet, visits: [result.data, ...(pet.visits ?? [])] }));
    notify('New clinical visit logged successfully');
    return true;
  }

  return {
    notice, loadClinicData, dismissStatus, toast, ownerCount: owners.length, isLoadingData,
    searchQuery, setSearchQuery, filteredOwners, selectedOwner, selectedOwnerId, selectedPet, selectedPetId,
    mobilePane, setMobilePane, petTypes, startCreateOwner, cancelCreateOwner, selectOwner, selectPet,
    isCreatingOwner, isEditingOwner, setIsEditingOwner, isAddingPet, setIsAddingPet, isEditingPet, setIsEditingPet,
    handleCreateOwner, handleUpdateOwner, handleAddPet, handleUpdatePet, handleLogVisit
  };
}

export type ReceptionDeskModel = ReturnType<typeof useReceptionDesk>;
