import { configureStore } from '@reduxjs/toolkit';
import { petClinicApi } from '../services/petClinicApi';

export const store = configureStore({
  reducer: {
    [petClinicApi.reducerPath]: petClinicApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(petClinicApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
