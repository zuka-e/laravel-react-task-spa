import { Switch, Route as DefaultRoute, Redirect } from 'react-router-dom';

import Home from './pages';
import { Privacy, Terms } from './pages/static';
import {
  SignUp,
  EmailVerification,
  SignIn,
  Account,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
} from './pages/auth';
import * as TaskBoard from 'pages/boards';
import { NotFound } from './pages/error';
import { setFlash } from './store/slices/authSlice';
import { useAppDispatch, useAppLocation, useAppSelector } from './utils/hooks';
import { isAfterRegistration, isSignedIn } from './utils/auth';

const Route = ({ ...rest }) => {
  const notFound = useAppSelector((state) => state.app.notFound);
  return notFound ? <NotFound /> : <DefaultRoute {...rest} />;
};

const GuestRoute = ({ ...rest }) => {
  const location = useAppLocation();

  if (isAfterRegistration()) return <Redirect to="/email-verification" />;

  return isSignedIn() ? (
    <Redirect to={location.state?.from || '/'} />
  ) : (
    <Route {...rest} />
  );
};

/** @see https://v5.reactrouter.com/web/example/auth-workflow */
const AuthRoute = ({ ...rest }) => {
  const flash = useAppSelector((state) => state.auth.flash);
  const dispatch = useAppDispatch();
  const location = useAppLocation();

  if (!isSignedIn()) {
    if (flash.slice(-1)[0]?.message !== 'ログアウトしました')
      dispatch(setFlash({ type: 'error', message: 'ログインしてください' }));

    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location } as typeof location['state'],
        }}
      />
    );
  }

  return <Route {...rest} />;
};

const Routes = () => {
  // https://nextjs.org/docs/migrating/from-react-router#scroll-restoration

  // const href = window.location.href;

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [href]);

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/terms" component={Terms} />
      <Route exact path="/privacy" component={Privacy} />
      <GuestRoute exact path="/register" component={SignUp} />
      <AuthRoute path="/email-verification" component={EmailVerification} />
      <AuthRoute path="/email/verify" component={VerifyEmail} />
      <GuestRoute exact path="/login" component={SignIn} />
      <AuthRoute exact path="/account" component={Account} />
      <GuestRoute exact path="/forgot-password" component={ForgotPassword} />
      <GuestRoute exact path="/reset-password" component={ResetPassword} />

      <AuthRoute exact path="/users/:userId/boards">
        <TaskBoard.Index />
      </AuthRoute>
      <AuthRoute exact path="/users/:userId/boards/:boardId">
        <TaskBoard.Show />
      </AuthRoute>

      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default Routes;
