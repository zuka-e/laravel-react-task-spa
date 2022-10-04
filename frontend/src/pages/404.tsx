import Head from 'next/head';

import { HttpErrorLayout } from 'layouts';

const NotFound = () => {
  const title = '404 Not Found';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <HttpErrorLayout
        title={title}
        description="ページが見つかりませんでした。"
        hint="お探しのページは移動または削除された可能性があります。"
      />
    </>
  );
};

export default NotFound;
