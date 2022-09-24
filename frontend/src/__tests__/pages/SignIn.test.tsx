import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useRouter } from 'next/router';
import { Provider } from 'react-redux';

import { initializeStore, store } from 'mocks/store';
import { APP_NAME, GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import SignIn from 'pages/login';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  initializeStore();
});

describe('SignIn', () => {
  const signInFormName = new RegExp('Sign in to ' + APP_NAME, 'i');
  const signUpFormName = /Create an account/i;
  const forgotPasswordFormName = /Forgot Password\\?/i;
  const emailFieldName = /Email Address/i;
  const passwordFieldName = /^Password(?!.*Confirm)/i;
  const submitButtonName = /Sign in/i;

  describe('Form setup', () => {
    it('should display a login form', () => {
      render(
        <Provider store={store}>
          <SignIn />
        </Provider>
      );

      expect(
        screen.getByRole('heading', { name: signInFormName })
      ).toBeVisible();
    });
  });

  it('should display password by a show password option', () => {
    render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );

    expect(
      screen.queryByRole('textbox', { name: passwordFieldName })
    ).toBeNull();

    userEvent.click(screen.getByRole('checkbox', { name: /Show password/i }));

    expect(
      screen.getByRole('textbox', { name: passwordFieldName })
    ).toBeVisible();
  });

  describe('Link existence', () => {
    it('has a link to the registration page', () => {
      (useRouter as jest.Mock).mockReturnValue({
        push: jest.fn(),
      });

      render(
        <Provider store={store}>
          <SignIn />
        </Provider>
      );

      userEvent.click(screen.getByRole('button', { name: signUpFormName }));
      expect(useRouter().push).toHaveBeenCalledWith('/register');
    });

    it('has a button link to the forgot-password page', () => {
      (useRouter as jest.Mock).mockReturnValue({
        push: jest.fn(),
      });

      render(
        <Provider store={store}>
          <SignIn />
        </Provider>
      );

      userEvent.click(
        screen.getByRole('button', { name: forgotPasswordFormName })
      );

      expect(useRouter().push).toHaveBeenCalledWith('/forgot-password');
    });
  });

  describe('Form input', () => {
    it('should display an error message with the wrong input', async () => {
      render(
        <Provider store={store}>
          <SignIn />
        </Provider>
      );

      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const passwordField = screen.getByLabelText(passwordFieldName);
      const submit = screen.getByRole('button', { name: submitButtonName });
      const errorMessage = /^Error/;

      expect(screen.queryByRole('alert')).toBeNull();
      expect(screen.queryByText(errorMessage)).toBeNull();

      userEvent.type(emailField, GUEST_EMAIL);
      userEvent.type(passwordField, GUEST_PASSWORD + 'a');
      userEvent.click(submit);

      expect(await screen.findByRole('alert')).toBeVisible();
      expect(screen.getByText(errorMessage)).toBeVisible();
    });

    it('should be authenticated with the right input', async () => {
      render(
        <Provider store={store}>
          <SignIn />
        </Provider>
      );

      expect(store.getState().auth.signedIn).toBe(undefined);

      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const passwordField = screen.getByLabelText(passwordFieldName);
      const submit = screen.getByRole('button', { name: submitButtonName });

      userEvent.type(emailField, GUEST_EMAIL);
      userEvent.type(passwordField, GUEST_PASSWORD);
      userEvent.click(submit);

      await waitFor(() => {
        expect(store.getState().auth.signedIn).toBe(true);
      });
    });
  });
});
