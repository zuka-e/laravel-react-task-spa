import Head from 'next/head';

import { HttpErrorLayout } from 'layouts';

const Forbidden = () => {
  const title = '403 Forbidden';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <HttpErrorLayout title={title} description="不正なリクエストです。" />
    </>
  );
};

export default Forbidden;
