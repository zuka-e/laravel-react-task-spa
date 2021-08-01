import React, { useEffect } from 'react';

import { Helmet } from 'react-helmet-async';

import { APP_NAME } from 'config/app';
import { Header, Footer } from 'layouts';

type BaseLayoutProps = { subtitle: string };

const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
  const href = window.location.href;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [href]);

  return (
    <React.Fragment>
      <Helmet>
        <title>
          {props.subtitle} | {APP_NAME}
        </title>
      </Helmet>
      <Header />
      {props.children}
      <Footer />
    </React.Fragment>
  );
};

export default BaseLayout;
