import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import Loading from './layouts/Loading';
import FlashMessage from './templates/FlashMessage';
import { initializeAuthState } from './utils/auth';
import { useAppSelector } from './store/hooks';

const App: React.FC = () => {
  const { signedIn, loading, flash } = useAppSelector((state) => state.auth);

  // `localStorage`と`store`のログイン状態を初期化
  useEffect(() => {
    initializeAuthState();
  }, [signedIn]);

  // 値を評価する準備が整うまで待機
  if (!isReady()) return <Loading />;

  return (
    <Router>
      {loading && <Loading />}
      {flash && <FlashMessage type={flash.type} message={flash.message} />}
      <Routes />
    </Router>
  );
};

export default App;
