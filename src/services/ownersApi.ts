import type { Owner, OwnerFields } from '../types';
import { petClinicApi } from './petClinicApi';

export const ownersApi = petClinicApi.injectEndpoints({
  endpoints: (build) => ({
    getOwners: build.query<Owner[], void>({
      async queryFn(_arg, _api, _options, request) {
        const result = await request({ url: '/owners' });
        // PetClinic v1 represents an empty directory with a bodyless 404.
        if (result.error?.status === 404 && result.error.emptyBody) return { data: [] };
        if (result.error) return { error: result.error };
        if (!Array.isArray(result.data)) return { error: { status: 'UNKNOWN' } };
        return { data: result.data };
      }
    }),
    createOwner: build.mutation<Owner, OwnerFields>({
      query: (data) => ({ url: '/owners', method: 'POST', data })
    }),
    updateOwner: build.mutation<null, { ownerId: number; fields: OwnerFields }>({
      query: ({ ownerId, fields }) => ({ url: `/owners/${ownerId}`, method: 'PUT', data: fields })
    })
  })
});
