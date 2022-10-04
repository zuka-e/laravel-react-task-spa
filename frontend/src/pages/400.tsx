import Head from 'next/head';

import { HttpErrorLayout } from 'layouts';

const BadRequest = () => {
  const title = '400 Bad Request';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <HttpErrorLayout title={title} description="不正なリクエストです。" />
    </>
  );
};

export default BadRequest;
