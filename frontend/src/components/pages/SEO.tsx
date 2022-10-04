// https://nextjs.org/docs/migrating/from-create-react-app#search-engine-optimization

import Head from 'next/head';

import { APP_URL, APP_NAME } from 'config/app';

const SEO = (props: { title: string; description: string }) => {
  const { title, description } = props;

  const formatTitle = (title: string) =>
    title ? `${title} | ${APP_NAME}` : APP_NAME;

  return (
    <Head>
      <title>{formatTitle(title)}</title>
      <meta name="description" content={description} />
      <meta property="og:url" content={APP_URL} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:image" content={`${APP_URL}/logo192.png`} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Head>
  );
};

export default SEO;
