import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import NotFound from './pages/error/NotFound';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/register' component={SignUp} />
      <Route exact path='/login'>
        <SignIn />
      </Route>
      <Route path='*' component={NotFound} />
    </Switch>
  );
};

export default Routes;
