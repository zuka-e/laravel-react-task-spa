import Head from 'next/head';

import { HttpErrorLayout } from 'layouts';

const ServiceUnavailable = () => {
  const title = '503 Service Unavailable';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <HttpErrorLayout
        title={title}
        description="このページは現在動作していません。"
        hint="時間を置いてもう一度お試しください。"
      />
    </>
  );
};

export default ServiceUnavailable;
