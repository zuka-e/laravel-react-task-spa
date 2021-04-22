import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import Loading from './layouts/Loading';

function App() {
  return (
    <Router>
      <Loading />
      <Routes />
    </Router>
  );
}

export default App;
