import { render, screen } from '@testing-library/react';

import { useRouter } from 'next/router';
import { Provider } from 'react-redux';

import store from 'mocks/store';
import { PageHandler } from 'components/pages';
import { setHttpStatus } from 'store/slices';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Page handler', () => {
  (useRouter as jest.Mock).mockReturnValue({
    asPath: '',
  });

  const errorMessages = [
    '400 Bad Request',
    '403 Forbidden',
    '404 Not Found',
    '419 Page Expired',
    '429 Too Many Requests',
    '500 Internal Server Error',
    '503 Service Unavailable',
  ];

  errorMessages.forEach((errorMessage) => {
    const status = parseInt(errorMessage.split(' ')[0]);

    it(`should render ${status} if the error is detected`, () => {
      render(
        <Provider store={store}>
          <PageHandler Component={() => <></>} pageProps={{}} />
        </Provider>
      );
      store.dispatch(setHttpStatus(status));

      expect(screen.getByRole('heading', { name: errorMessage })).toBeVisible();
    });
  });
});
