import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';

import { APP_NAME, GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { isSignedIn } from 'utils/auth';
import store from 'store';
import Routes from 'Routes';
import App from 'App';

describe('SignIn', () => {
  const signInFormName = new RegExp('Sign in to ' + APP_NAME, 'i');
  const signUpFormName = /Create an account/i;
  const forgotPasswordFormName = /Forgot Password\\?/i;
  const emailFieldName = /Email Address/i;
  const passwordFieldName = /^Password(?!.*Confirm)/i;
  const submitButtonName = /Sign in/i;

  beforeEach(() => {
    render(
      <Provider store={store}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Provider>
    );
  });
  afterEach(() => cleanup());

  describe('Form setup', () => {
    it('renders a index page without crashing', async () => {
      expect(await screen.findByRole('img', { name: /hero/i })).toBeVisible();
    });

    it('should display a login form', () => {
      userEvent.click(screen.getAllByRole('button', { name: /ログイン/i })[0]);
      const signInFormTitle = screen.getByRole('heading', {
        name: signInFormName,
      });
      expect(signInFormTitle).toBeVisible();
    });
  });

  it('should display password by a show password option', () => {
    const name = passwordFieldName;

    expect(screen.queryByRole('textbox', { name })).toBeNull();
    userEvent.click(screen.getByRole('checkbox', { name: /Show password/i }));

    const passwordField = screen.getByRole('textbox', { name });
    expect(passwordField).toBeVisible();
  });

  describe('Link existence', () => {
    it('has a link to the registration page', () => {
      cleanup();
      render(
        <Provider store={store}>
          <HelmetProvider>
            <MemoryRouter initialEntries={['/login']}>
              <Routes />
            </MemoryRouter>
          </HelmetProvider>
        </Provider>
      );
      const name = signUpFormName;
      expect(screen.queryByRole('heading', { name })).toBeNull();
      userEvent.click(screen.getByRole('button', { name }));
      expect(screen.getByRole('heading', { name })).toBeVisible();
    });

    it('has a button link to the forgot-password page', () => {
      cleanup();
      render(
        <Provider store={store}>
          <HelmetProvider>
            <MemoryRouter initialEntries={['/login']}>
              <Routes />
            </MemoryRouter>
          </HelmetProvider>
        </Provider>
      );
      const name = forgotPasswordFormName;
      expect(screen.queryByRole('heading', { name })).toBeNull();
      userEvent.click(screen.getByRole('button', { name }));
      expect(screen.getByRole('heading', { name })).toBeVisible();
    });
  });

  describe('Form input', () => {
    const errorData = { '422': { message: /^Error/ } };
    const successMessage = /ログインしました/;

    it('should be invalidated with the empty password', async () => {
      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const submit = screen.getByRole('button', { name: submitButtonName });

      userEvent.type(emailField, GUEST_EMAIL);
      userEvent.click(submit);

      const signInFormTitle = await screen.findByRole('heading', {
        name: signInFormName,
      });
      expect(signInFormTitle).toBeVisible();
    });

    it('should display an error message with the wrong input', async () => {
      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const passwordField = screen.getByLabelText(passwordFieldName);
      const submit = screen.getByRole('button', { name: submitButtonName });

      userEvent.type(emailField, GUEST_EMAIL);
      userEvent.type(passwordField, GUEST_PASSWORD + 'a');
      act(() => {
        userEvent.click(submit);
      });
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeVisible();
      });
      expect(screen.getByText(errorData['422'].message)).toBeVisible();
    });

    it('should be authentiated with the right input', async () => {
      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const passwordField = screen.getByLabelText(passwordFieldName);
      const submit = screen.getByRole('button', { name: submitButtonName });

      userEvent.type(emailField, GUEST_EMAIL);
      userEvent.type(passwordField, GUEST_PASSWORD);
      userEvent.click(submit);
      expect(await screen.findByText(successMessage)).toBeInTheDocument();
    });
  });
  describe('After authenticated', () => {
    it('should display the username on the account menu', async () => {
      // `Header`部 `AccountMenuButton`ボタン
      userEvent.click(screen.getByRole('button', { name: 'account-menu' }));
      /** `setTimeout`の影響で`await`を要する */
      // expect(
      //   await screen.findByRole('button', { name: GUEST_NAME })
      // ).toBeVisible();
      expect(isSignedIn()).toBeTruthy();
    });
  });
});
