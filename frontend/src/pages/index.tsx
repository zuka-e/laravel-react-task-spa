import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@material-ui/core';
import { APP_NAME } from '../config/app';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';

const Home: React.FC = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>{APP_NAME}</title>
      </Helmet>
      <Header />
      <Container>{/*  */}</Container>
      <Footer />
    </React.Fragment>
  );
};

export default Home;
