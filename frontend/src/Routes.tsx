import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import NotFound from './pages/error/NotFound';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/terms' component={Terms} />
      <Route exact path='/privacy' component={Privacy} />
      <Route exact path='/register' component={SignUp} />
      <Route exact path='/login'>
        <SignIn />
      </Route>
      <Route path='*' component={NotFound} />
    </Switch>
  );
};

export default Routes;
