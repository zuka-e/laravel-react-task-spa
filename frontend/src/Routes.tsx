import React, { useEffect } from 'react';

import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import Home from './pages';
import SignUp from './pages/auth/SignUp';
import EmailVerification from './pages/auth/EmailVerification';
import SignIn from './pages/auth/SignIn';
import Account from './pages/auth/Account';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import * as TaskBoard from 'pages/boards';
import NotFound from './pages/error/NotFound';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { setFlash } from './store/slices/authSlice';
import { useAppDispatch, useQuery } from './utils/hooks';
import { isReady, isSentEmail, isSignedIn } from './utils/auth';

const GuestRoute = ({ ...rest }) => {
  if (isSentEmail()) return <Redirect to='/email-verification' />;
  return isSignedIn() ? <Redirect to='/' /> : <Route {...rest} />;
};

const AuthRoute = ({ ...rest }) => {
  return isReady() && isSignedIn() ? <Route {...rest} /> : <Redirect to='/' />;
};

const Routes: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const verified = useQuery().get('verified');

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
