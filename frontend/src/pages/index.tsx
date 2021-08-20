import { Fragment, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import { isSignedIn } from 'utils/auth';
import { useAppSelector } from 'utils/hooks';
import { BaseLayout } from 'layouts';
import { Hero, Features } from 'components/home/LandingPage';

const LandingPage = () => (
  <Fragment>
    <Hero />
    <Features />
  </Fragment>
);

const renderHome = () => {
  if (isSignedIn()) {
    // return <Dashboard />;
  } else {
    return <LandingPage />;
  }
};

const Home = () => {
  const history = useHistory();
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    isSignedIn() && history.replace(`users/${userId}/boards`);
  }, [history, userId]);

  return <BaseLayout subtitle=''>{renderHome()}</BaseLayout>;
};

export default Home;
