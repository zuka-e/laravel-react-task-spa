import React, { useEffect } from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';
import { Loading, FlashNotification } from './layouts';
import { initializeAuthState, isReady } from './utils/auth';
import { useAppSelector } from './utils/hooks';

const App: React.FC = () => {
  const { signedIn, loading } = useAppSelector((state) => state.auth);

  // `localStorage`と`store`のログイン状態を初期化
  useEffect(() => {
    initializeAuthState();
  }, [signedIn]);

  // 値を評価する準備が整うまで待機
  if (!isReady()) return <Loading />;

  return (
    <Router>
      {loading && <Loading />}
      <FlashNotification />
      <Routes />
    </Router>
  );
};

export default App;
