import React from 'react';
import { Switch, Route } from 'react-router-dom';

const Routes = () => {
  return (
    <Switch>
      <Route exact path='/'>
        {/* ex. <Home /> */}
      </Route>
      <Route path='*'>{/* ex. <NotFound /> */}</Route>
    </Switch>
  );
};

export default Routes;
