import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import store from '../../store';
import { isSentEmail, isSignedIn } from '../../utils/auth';
import { GUEST_EMAIL, GUEST_PASSWORD } from '../../mocks/utils/const';
import Routes from '../../Routes';
import App from '../../App';

describe('Sign Up', () => {
  const newEmail = 'test' + GUEST_EMAIL;
  const password = 'password';

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

  it('renders a index page without crashing', async () => {
    // 初期画面表示まで待機
    expect(await screen.findByRole('img', { name: /hero/i })).toBeVisible();
  });

  it('should display a registraion form', () => {
    // ユーザー登録フォーム (`SignUp`) 表示ボタン押下
    userEvent.click(screen.getByRole('button', { name: /始める/i }));
    // 表示確認
    const title = screen.getByRole('heading', { name: /Create an account/i });
    expect(title).toBeVisible();
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
    expect(screen.queryByRole('heading', { name: /Sign in/i })).toBeNull();
    userEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeVisible();
  });

  it('should display password by a show password option', () => {
    expect(screen.queryByRole('textbox', { name: /Password/i })).toBeNull();
    // パスワード表示オプション有効化
    userEvent.click(screen.getByRole('checkbox', { name: /Show password/i }));

    const passwordField = screen.getByRole('textbox', {
      name: /^Password(?!.*Conf)/i,
    });
    const passwordConfirmationField = screen.getByRole('textbox', {
      name: /Password Confirmation/i,
    });
    expect(passwordField).toBeVisible();
    expect(passwordConfirmationField).toBeVisible();
  });

  it('should not be registered with the wrong email input', async () => {
    const invalidEmail = GUEST_EMAIL + '@example';
    const emailField = screen.getByRole('textbox', { name: /Email/i });
    const passwordField = screen.getByLabelText(/^Password(?!.*Conf)/i);
    const passwordConfirmationField = screen.getByLabelText(/Password Conf/i);
    const submit = screen.getByRole('button', { name: /Create an account/i });

    // フォーム入力 (バリデーションエラー: email)
    userEvent.type(emailField, invalidEmail);
    userEvent.type(passwordField, password);
    userEvent.type(passwordConfirmationField, password + 'a');
    userEvent.click(submit);
    // ページ遷移しない
    expect(
      await screen.findByRole('heading', { name: /Create an account/i })
    ).toBeVisible();
  });

  it('should not be registered with the wrong password input', async () => {
    const emailField = screen.getByRole('textbox', { name: /Email/i });
    const passwordField = screen.getByLabelText(/^Password(?!.*Conf)/i);
    const passwordConfirmationField = screen.getByLabelText(/Password Conf/i);
    const submit = screen.getByRole('button', { name: /Create an account/i });

    // フォーム入力 (バリデーションエラー: password不一致)
    userEvent.type(emailField, newEmail);
    userEvent.type(passwordField, password);
    userEvent.type(passwordConfirmationField, password + 'a');
    userEvent.click(submit);
    // ページ遷移しない
    expect(
      await screen.findByRole('heading', { name: /Create an account/i })
    ).toBeVisible();
  });

  it('should display an error message when email already exists', async () => {
    const emailField = screen.getByRole('textbox', { name: /Email/i });
    const passwordField = screen.getByLabelText(/^Password(?!.*Conf)/i);
    const passwordConfirmationField = screen.getByLabelText(/Password Conf/i);
    const submit = screen.getByRole('button', { name: /Create an account/i });

    userEvent.type(emailField, GUEST_EMAIL);
    userEvent.type(passwordField, GUEST_PASSWORD);
    userEvent.type(passwordConfirmationField, GUEST_PASSWORD);
    act(() => {
      userEvent.click(submit);
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeVisible();
    });
    expect(screen.getByText(/既に使用されて/)).toBeVisible();
  });

  it('should be registered with the right input', async () => {
    const emailField = screen.getByRole('textbox', { name: /Email/i });
    const passwordField = screen.getByLabelText(/^Password(?!.*Conf)/i);
    const passwordConfirmationField = screen.getByLabelText(/Password Conf/i);
    const submit = screen.getByRole('button', { name: /Create an account/i });

    userEvent.type(emailField, newEmail);
    userEvent.type(passwordField, password);
    userEvent.type(passwordConfirmationField, password);
    userEvent.click(submit);

    // `FlashNotification`
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(screen.getByText(/ユーザー登録が完了しました/i)).toBeVisible();

    // `EmailVerification`
    expect(isSentEmail()).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: /認証用メールを送信/i })
    ).toBeVisible();
    expect(screen.getByRole('button', { name: /再送信/i })).toBeVisible();
    // ページ移動後は再表示しない
    cleanup();
    render(
      <Provider store={store}>
        <HelmetProvider>
          <MemoryRouter initialEntries={['/email-verification']}>
            <Routes />
          </MemoryRouter>
        </HelmetProvider>
      </Provider>
    );
    expect(isSentEmail()).toBeFalsy();
    expect(
      screen.queryByRole('heading', { name: /認証用メールを送信/i })
    ).toBeNull();

    // `store`
    expect(isSignedIn()).toBeTruthy();
    expect(store.getState().auth.user?.email).toBe(newEmail);
  });
});
