import { Fragment } from 'react';
import Head from 'next/head';

import { APP_NAME } from 'config/app';
import { Header, Footer } from 'layouts';

type BaseLayoutProps = { subtitle: string; withoutHeaders?: boolean };

const BaseLayout: React.FC<BaseLayoutProps> = (props) => (
  <Fragment>
    <Head>
      <title>
        {props.subtitle ? `${props.subtitle} | ${APP_NAME}` : APP_NAME}
      </title>
    </Head>
    {!props.withoutHeaders && <Header />}
    {props.children}
    {!props.withoutHeaders && <Footer />}
  </Fragment>
);

export default BaseLayout;
