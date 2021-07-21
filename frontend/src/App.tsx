import React, { useEffect } from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { initializeAuthState, isReady } from './utils/auth';
import { useAppSelector } from './utils/hooks';
import { Loading, FlashNotification } from './layouts';
import Routes from './Routes';

const App: React.FC = () => {
  const signedIn = useAppSelector((state) => state.auth.signedIn);

  // `localStorage`と`store`のログイン状態を初期化
  useEffect(() => {
    initializeAuthState();
  }, [signedIn]);

  // 値を評価する準備が整うまで待機
  if (!isReady()) return <Loading />;

  return (
    <Router>
      <Loading />
      <FlashNotification />
      <Routes />
    </Router>
  );
};

export default App;
