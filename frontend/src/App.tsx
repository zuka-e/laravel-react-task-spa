import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import Loading from './layouts/Loading';
import { initializeAuthState } from './utils/auth';
import { useAppSelector } from './store/hooks';

const App: React.FC = () => {
  const { signedIn } = useAppSelector((state) => state.auth);

  // `sessionStorage`と`store`のログイン状態を初期化
  useEffect(() => {
    initializeAuthState();
  }, [signedIn]);

  return (
    <Router>
      <Loading />
      <Routes />
    </Router>
  );
};

export default App;
