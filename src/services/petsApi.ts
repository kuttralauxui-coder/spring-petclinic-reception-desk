import type { Pet, PetDetails, PetType } from '../types';
import { petClinicApi } from './petClinicApi';

type PetRequest = { ownerId: number; details: PetDetails };

export const petsApi = petClinicApi.injectEndpoints({
  endpoints: (build) => ({
    getPetTypes: build.query<PetType[], void>({
      query: () => ({ url: '/pettypes' })
    }),
    createPet: build.mutation<Pet, PetRequest>({
      query: ({ ownerId, details }) => ({ url: `/owners/${ownerId}/pets`, method: 'POST', data: details })
    }),
    updatePet: build.mutation<null, PetRequest & { petId: number }>({
      query: ({ ownerId, petId, details }) => ({
        url: `/owners/${ownerId}/pets/${petId}`, method: 'PUT', data: details
      })
    })
  })
});
