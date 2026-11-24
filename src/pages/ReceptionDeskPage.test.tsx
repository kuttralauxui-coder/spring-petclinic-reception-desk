import { StrictMode } from 'react';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { AppProviders } from '../app/AppProviders';
import { store } from '../app/store';
import { petClinicApi } from '../services/petClinicApi';
import ReceptionDeskPage from './ReceptionDeskPage';

const { adapter } = vi.hoisted(() => ({ adapter: vi.fn() }));

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>();
  return {
    ...actual,
    default: Object.assign({}, actual.default, {
      create: (config: Parameters<typeof actual.default.create>[0]) =>
        actual.default.create({ ...config, adapter })
    })
  };
});

beforeEach(() => {
  adapter.mockReset();
  store.dispatch(petClinicApi.util.resetApiState());
});

it('loads the desk, accepts a 204 owner update, and retains a failed visit draft for retry', async () => {
  const type = { id: 2, name: 'dog' };
  const owner = {
    id: 1, firstName: 'Sarah', lastName: 'Jenkins', address: '1 Main St', city: 'Madison',
    telephone: '6085550199',
    pets: [{ id: 3, ownerId: 1, name: 'Bella', birthDate: '2020-01-01', type, visits: [] }]
  };
  let visitAttempts = 0;
  adapter.mockImplementation(async (config: InternalAxiosRequestConfig) => {
    const respond = (data: unknown, status = 200) => ({ data, status, statusText: '', headers: {}, config });
    switch (`${config.method} ${config.url}`) {
      case 'get /owners':
        return respond([owner]);
      case 'get /pettypes':
        return respond([type]);
      case 'put /owners/1':
        return respond('', 204);
      case 'post /owners/1/pets/3/visits':
        if (++visitAttempts === 1) {
          throw new AxiosError('Save failed', 'ERR_BAD_REQUEST', config, undefined, respond('Please retry', 400));
        }
        return respond({ id: 4, ...JSON.parse(config.data) }, 201);
      default:
        throw new Error(`Unexpected request ${config.method} ${config.url}`);
    }
  });

  render(<StrictMode><AppProviders><ReceptionDeskPage /></AppProviders></StrictMode>);
  expect(await screen.findByRole('heading', { name: 'Log New Clinical Visit for Bella' })).toBeVisible();
  expect(adapter).toHaveBeenCalledWith(expect.objectContaining({ baseURL: '/petclinic-api', url: '/owners' }));
  expect(adapter).toHaveBeenCalledTimes(2);

  fireEvent.click(await screen.findByRole('button', { name: 'Edit Owner' }));
  fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Chicago' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
  expect(await screen.findByText('Chicago')).toBeVisible();

  const notes = screen.getByPlaceholderText('e.g., Annual booster vaccination & weight check');
  const submit = screen.getByRole('button', { name: 'Register Visit' });
  fireEvent.change(notes, { target: { value: '  Annual booster  ' } });
  fireEvent.click(submit);
  expect(await screen.findByText('Could not register the visit. Check the form values and try again.')).toBeVisible();
  expect(screen.queryByText('Please retry')).not.toBeInTheDocument();
  expect(notes).toHaveValue('  Annual booster  ');

  await waitFor(() => expect(submit).toBeEnabled());
  fireEvent.click(submit);
  expect(await screen.findByText('Annual booster')).toBeVisible();
  await waitFor(() => expect(notes).toHaveValue(''));
});

it('shows a retry after a connection timeout and accepts a bodyless 404 as an empty directory', async () => {
  let ownerRequests = 0;
  adapter.mockImplementation(async (config: InternalAxiosRequestConfig) => {
    if (config.url === '/owners') {
      ownerRequests++;
      if (ownerRequests === 1) throw new AxiosError('Timed out', 'ECONNABORTED', config);
      throw new AxiosError('Not found', 'ERR_BAD_REQUEST', config, undefined, {
        data: '', status: 404, statusText: 'Not Found', headers: {}, config
      });
    }
    return { data: [{ id: 2, name: 'dog' }], status: 200, statusText: '', headers: {}, config };
  });

  render(<AppProviders><ReceptionDeskPage /></AppProviders>);
  expect(await screen.findByRole('alert')).toHaveTextContent('The request timed out.');
  expect(adapter).toHaveBeenCalledWith(expect.objectContaining({ timeout: 15_000 }));
  fireEvent.click(screen.getByRole('button', { name: 'Retry connection' }));
  expect(await screen.findByText('0 registered owners')).toBeVisible();
  await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  await waitFor(() => expect(screen.getByRole('button', { name: '+ New Customer' })).toBeEnabled());
  expect(ownerRequests).toBe(2);
});
