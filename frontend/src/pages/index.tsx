import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '../config/app';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import { isSignedIn } from '../utils/auth';

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
