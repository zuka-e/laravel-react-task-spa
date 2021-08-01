import React, { useEffect } from 'react';

import { Helmet } from 'react-helmet-async';

import { APP_NAME } from 'config/app';
import { useQuery } from 'utils/hooks';
import { Header, Footer } from 'layouts';

type BaseLayoutProps = { subtitle: string };

const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
  const query = useQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

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
