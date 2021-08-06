import React, { useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';

import { APP_NAME } from 'config/app';
import { isSignedIn } from 'utils/auth';
import { useAppSelector } from 'utils/hooks';
import { Header, Footer } from 'layouts';
import { Hero, Features } from 'components/home/LandingPage';

const LandingPage = () => (
  <React.Fragment>
    <Hero />
    <Features />
  </React.Fragment>
);

const renderHome = () => {
  if (isSignedIn()) {
    // return <Dashboard />;
  } else {
    return <LandingPage />;
  }
};

const Home: React.FC = () => {
  const history = useHistory();
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    isSignedIn() && history.push(`users/${userId}/boards`);
  }, [history, userId]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{APP_NAME}</title>
      </Helmet>
      <Header />
      {renderHome()}
      <Footer />
    </React.Fragment>
  );
};

export default Home;
