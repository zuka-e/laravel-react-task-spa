import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import Loading from './layouts/Loading';
import { initializeAuthState } from './utils/auth';

const App: React.FC = () => {
  // `sessionStorage`と`store`のログイン状態を初期化
  useEffect(() => {
    initializeAuthState();
  }, []);

  return (
    <Router>
      <Loading />
      <Routes />
    </Router>
  );
};

export default App;
