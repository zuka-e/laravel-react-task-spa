import Head from 'next/head';

import { HttpErrorLayout } from 'layouts';

const PageExpired = () => {
  const title = '419 Page Expired';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <HttpErrorLayout
        title={title}
        description="ページの有効期限が切れました。"
        hint="もう一度お試しください。"
      />
    </>
  );
};

export default PageExpired;
