import type { Visit, VisitFields } from '../types';
import { petClinicApi } from './petClinicApi';

export const visitsApi = petClinicApi.injectEndpoints({
  endpoints: (build) => ({
    createVisit: build.mutation<Visit, { ownerId: number; petId: number; fields: VisitFields }>({
      query: ({ ownerId, petId, fields }) => ({
        url: `/owners/${ownerId}/pets/${petId}/visits`, method: 'POST', data: fields
      })
    })
  })
});
