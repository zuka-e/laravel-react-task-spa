import React, { useEffect } from 'react';

import { Helmet } from 'react-helmet-async';

import { APP_NAME } from 'config/app';
import { isLoading } from 'utils/api';
import { Header, Footer, Progressbar } from 'layouts';

type BaseLayoutProps = { subtitle: string };

const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>
          {props.subtitle} | {APP_NAME}
        </title>
      </Helmet>
      <Header />
      {isLoading() && <Progressbar />}
      {props.children}
      <Footer />
    </React.Fragment>
  );
};

export default BaseLayout;
