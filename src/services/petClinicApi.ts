import { createApi } from '@reduxjs/toolkit/query';
import { axiosBaseQuery } from './axiosBaseQuery';

export const petClinicApi = createApi({
  reducerPath: 'petClinicApi',
  baseQuery: axiosBaseQuery,
  keepUnusedDataFor: 0,
  endpoints: () => ({})
});
