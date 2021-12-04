import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { APP_NAME, GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { isAfterRegistration, isSignedIn } from 'utils/auth';
import store from 'store';
import Routes from 'Routes';
import App from 'App';

describe('Sign Up', () => {
  const signInFormName = new RegExp('Sign in to ' + APP_NAME, 'i');
  const signUpFormName = /Create an account/i;
  const emailFieldName = /Email Address/i;
  const passwordFieldName = /^Password(?!.*Confirm)/i;
  const passwordConfirmFieldName = /Password Confirmation/i;
  const submitButtonName = /Create an account/i;
  const emailVerificationTitle = /認証用メールを送信/;

  beforeEach(() => {
    // 各テストで`history`は初期化されない (cf. MemoryRouter)
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
      // 初期画面表示まで待機
      expect(await screen.findByRole('img', { name: /hero/i })).toBeVisible();
    });

    it('should display a registraion form', () => {
      // ユーザー登録フォーム (`SignUp`) 表示ボタン押下
      userEvent.click(screen.getByRole('button', { name: /始める/i }));
      // 表示確認
      const title = screen.getByRole('heading', { name: signUpFormName });
      expect(title).toBeVisible();
    });
  });

  it('has a link to the login page', async () => {
    // `history`を独立させるため`MemoryRouter`を使用し`render`し直す
    cleanup();
    render(
      <Provider store={store}>
        <HelmetProvider>
          <MemoryRouter initialEntries={['/register']}>
            <Routes />
          </MemoryRouter>
        </HelmetProvider>
      </Provider>
    );
    const signInSubmitName = /Sign in/i;
    expect(screen.queryByRole('heading', { name: signInFormName })).toBeNull();
    userEvent.click(screen.getByRole('button', { name: signInSubmitName }));
    expect(screen.getByRole('heading', { name: signInFormName })).toBeVisible();
  });

  it('should display password by a show password option', () => {
    expect(
      screen.queryByRole('textbox', { name: passwordFieldName })
    ).toBeNull();
    // パスワード表示オプション有効化
    userEvent.click(screen.getByRole('checkbox', { name: /Show password/i }));

    const passwordField = screen.getByRole('textbox', {
      name: passwordFieldName,
    });
    const passwordConfirmField = screen.getByRole('textbox', {
      name: passwordConfirmFieldName,
    });
    expect(passwordField).toBeVisible();
    expect(passwordConfirmField).toBeVisible();
  });

  describe('Form input', () => {
    const newEmail = 'test' + GUEST_EMAIL;
    const password = 'password';
    const errorData = { '422': { message: /^Error/ } };
    const successMessage = /ユーザー登録が完了しました/;
    const warning = /登録が抹消されます/;

    it('should not be registered with the wrong email input', async () => {
      const invalidEmail = GUEST_EMAIL + '@example';
      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const passwordField = screen.getByLabelText(passwordFieldName);
      const passwordConfirmField = screen.getByLabelText(
        passwordConfirmFieldName
      );
      const submit = screen.getByRole('button', { name: submitButtonName });

      // フォーム入力 (バリデーションエラー: email)
      userEvent.type(emailField, invalidEmail);
      userEvent.type(passwordField, password);
      userEvent.type(passwordConfirmField, password + 'a');
      userEvent.click(submit);
      // ページ遷移しない
      expect(
        await screen.findByRole('heading', { name: /Create an account/i })
      ).toBeVisible();
    });

    it('should not be registered with the wrong password input', async () => {
      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const passwordField = screen.getByLabelText(passwordFieldName);
      const passwordConfirmField = screen.getByLabelText(
        passwordConfirmFieldName
      );
      const submit = screen.getByRole('button', { name: submitButtonName });

      // フォーム入力 (バリデーションエラー: password不一致)
      userEvent.type(emailField, newEmail);
      userEvent.type(passwordField, password);
      userEvent.type(passwordConfirmField, password + 'a');
      userEvent.click(submit);
      // ページ遷移しない
      expect(
        await screen.findByRole('heading', { name: signUpFormName })
      ).toBeVisible();
    });

    it('should display an error message when email already exists', async () => {
      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const passwordField = screen.getByLabelText(passwordFieldName);
      const passwordConfirmField = screen.getByLabelText(
        passwordConfirmFieldName
      );
      const submit = screen.getByRole('button', { name: submitButtonName });

      userEvent.type(emailField, GUEST_EMAIL);
      userEvent.type(passwordField, GUEST_PASSWORD);
      userEvent.type(passwordConfirmField, GUEST_PASSWORD);
      act(() => {
        userEvent.click(submit);
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeVisible();
      });
      expect(screen.getByText(errorData['422'].message)).toBeVisible();
    });

    it('should be registered with the right input', async () => {
      const emailField = screen.getByRole('textbox', { name: emailFieldName });
      const passwordField = screen.getByLabelText(passwordFieldName);
      const passwordConfirmField = screen.getByLabelText(
        passwordConfirmFieldName
      );
      const submit = screen.getByRole('button', { name: submitButtonName });

      userEvent.type(emailField, newEmail);
      userEvent.type(passwordField, password);
      userEvent.type(passwordConfirmField, password);
      userEvent.click(submit);

      // `FlashNotification`
      expect(await screen.findAllByRole('alert')).toHaveLength(2);
      expect(screen.getByText(successMessage)).toBeVisible();
      expect(screen.getByText(warning)).toBeVisible();

      // `EmailVerification`
      expect(isAfterRegistration()).toBeTruthy();
      expect(
        screen.getByRole('heading', { name: emailVerificationTitle })
      ).toBeVisible();
      expect(screen.getByRole('button', { name: /再送信/ })).toBeVisible();

      expect(isSignedIn()).toBeTruthy();
      expect(store.getState().auth.user?.email).toBe(newEmail);
    });
  });

  describe('After authenticated', () => {
    it('should not display a EmailVerification after a page transition', () => {
      expect(isAfterRegistration()).toBeFalsy();
      expect(
        screen.queryByRole('heading', { name: emailVerificationTitle })
      ).toBeNull();
    });
  });
});
