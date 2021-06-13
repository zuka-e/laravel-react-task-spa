import React, { useEffect } from 'react';

import { Helmet } from 'react-helmet-async';

import { APP_NAME } from 'config/app';
import { isSignedIn } from 'utils/auth';
import { Header, Footer } from 'layouts';
import { Hero, Features } from 'components/Home';

const LP = () => (
  <React.Fragment>
    <Hero />
    <Features />
  </React.Fragment>
);

const renderHome = () => {
  if (isSignedIn()) {
    // return <Dashboard />;
  } else {
    return <LP />;
  }
};

const Home: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
