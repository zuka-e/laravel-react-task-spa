import { useEffect } from 'react';

import {
  Switch,
  Route as DefaultRoute,
  Redirect,
  useHistory,
} from 'react-router-dom';

import Home from './pages';
import { Privacy, Terms } from './pages/static';
import {
  SignUp,
  EmailVerification,
  SignIn,
  Account,
  ForgotPassword,
  ResetPassword,
} from './pages/auth';
import * as TaskBoard from 'pages/boards';
import { NotFound } from './pages/error';
import { setFlash } from './store/slices/authSlice';
import { useAppDispatch, useAppSelector, useQuery } from './utils/hooks';
import { isAfterRegistration, isSignedIn } from './utils/auth';

const Route = ({ ...rest }) => {
  const notFound = useAppSelector((state) => state.app.notFound);
  return notFound ? <NotFound /> : <DefaultRoute {...rest} />;
};

const GuestRoute = ({ ...rest }) => {
  if (isAfterRegistration()) return <Redirect to='/email-verification' />;
  return isSignedIn() ? <Redirect to='/' /> : <Route {...rest} />;
};

const AuthRoute = ({ ...rest }) => {
  return isSignedIn() ? <Route {...rest} /> : <Redirect to='/' />;
};

const Routes = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const verified = useQuery().get('verified');
  const href = window.location.href;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [href]);

  // 認証メールリンクからのリダイレクトの場合
  useEffect(() => {
    if (verified) {
      dispatch(setFlash({ type: 'success', message: '認証に成功しました。' }));
      history.push('/');
    }
  }, [dispatch, history, verified]);

  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/terms' component={Terms} />
      <Route exact path='/privacy' component={Privacy} />
      <GuestRoute exact path='/register' component={SignUp} />
      <AuthRoute path='/email-verification' component={EmailVerification} />
      <GuestRoute exact path='/login' component={SignIn} />
      <AuthRoute exact path='/account' component={Account} />
      <GuestRoute exact path='/forgot-password' component={ForgotPassword} />
      <GuestRoute exact path='/reset-password' component={ResetPassword} />

      <AuthRoute exact path='/users/:userId/boards'>
        <TaskBoard.Index />
      </AuthRoute>
      <AuthRoute exact path='/users/:userId/boards/:boardId'>
        <TaskBoard.Show />
      </AuthRoute>

      <Route path='*' component={NotFound} />
    </Switch>
  );
};

export default Routes;
