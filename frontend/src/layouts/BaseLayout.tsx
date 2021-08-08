import { Fragment } from 'react';

import { Helmet } from 'react-helmet-async';

import { APP_NAME } from 'config/app';
import { Header, Footer } from 'layouts';

type BaseLayoutProps = { subtitle: string; withoutHeaders?: boolean };

const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
  return (
    <Fragment>
      <Helmet>
        <title>
          {props.subtitle} | {APP_NAME}
        </title>
      </Helmet>
      {!props.withoutHeaders && <Header />}
      {props.children}
      {!props.withoutHeaders && <Footer />}
    </Fragment>
  );
};

export default BaseLayout;
