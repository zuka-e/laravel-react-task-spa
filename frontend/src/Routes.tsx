import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './pages';
import SignUp from './pages/auth/SignUp';
import EmailVerification from './pages/auth/EmailVerification';
import SignIn from './pages/auth/SignIn';
import Account from './pages/auth/Account';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import NotFound from './pages/error/NotFound';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { isReady, isSentEmail, isSignedIn } from './utils/auth';

const GuestRoute = ({ ...rest }) => {
  if (isSentEmail()) return <Redirect to='/email-verification' />;
  return isSignedIn() ? <Redirect to='/' /> : <Route {...rest} />;
};

const AuthRoute = ({ ...rest }) => {
  return isReady() && isSignedIn() ? <Route {...rest} /> : <Redirect to='/' />;
};

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/terms' component={Terms} />
      <Route exact path='/privacy' component={Privacy} />
      <GuestRoute exact path='/register' component={SignUp} />
      <AuthRoute path='/email-verification' component={EmailVerification} />
      <Route exact path='/login' component={SignIn} />
      <AuthRoute exact path='/account' component={Account} />
      <Route exact path='/forgot-password' component={ForgotPassword} />
      <Route exact path='/reset-password' component={ResetPassword} />
      <Route path='*' component={NotFound} />
    </Switch>
  );
};

export default Routes;
