import axios, { type AxiosRequestConfig } from 'axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { DEFAULT_API_BASE } from '../data/petClinicData';

type Request = Pick<AxiosRequestConfig, 'url' | 'method' | 'data'>;
type RequestError = {
  status: number | 'TIMEOUT' | 'NETWORK' | 'UNKNOWN';
  emptyBody?: boolean;
};

const client = axios.create({
  baseURL: DEFAULT_API_BASE,
  timeout: 15_000,
  headers: { Accept: 'application/json' }
});

function isEmpty(data: unknown) {
  return data === '' || data == null;
}

export const axiosBaseQuery: BaseQueryFn<Request, unknown, RequestError> = async (request, { signal }) => {
  try {
    const response = await client.request({ ...request, signal });
    return { data: isEmpty(response.data) ? null : response.data };
  } catch (error) {
    if (!axios.isAxiosError(error)) return { error: { status: 'UNKNOWN' } };
    if (error.response) {
      return { error: { status: error.response.status, emptyBody: isEmpty(error.response.data) } };
    }
    const timeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
    return { error: { status: timeout ? 'TIMEOUT' : 'NETWORK' } };
  }
};
