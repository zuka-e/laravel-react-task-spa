import Head from 'next/head';

import { HttpErrorLayout } from 'layouts';

const InternalServerError = () => {
  const title = '500 Internal Server Error';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <HttpErrorLayout
        title={title}
        description="このページは現在動作していません。"
      />
    </>
  );
};

export default InternalServerError;
