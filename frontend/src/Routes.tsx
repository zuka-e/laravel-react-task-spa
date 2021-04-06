import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from './pages/error/NotFound';

const Routes = () => {
  return (
    <Switch>
      <Route exact path='/'>
        {/* ex. <Home /> */}
      </Route>
      <Route path='*'>
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Routes;
