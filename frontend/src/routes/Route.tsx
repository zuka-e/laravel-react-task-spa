import type { AppProps } from 'next/app';

import { AuthRoute, GuestRoute } from 'routes';

const Route = (props: Pick<AppProps, 'Component' | 'pageProps'>) => {
  const { Component, pageProps } = props;

  return (
    <>
      {/* cf. https://alexsidorenko.com/blog/next-js-protected-routes/#move-user-logic-to-_appjs */}
      {pageProps.auth ? (
        <AuthRoute>
          <Component {...pageProps} />
        </AuthRoute>
      ) : pageProps.guest ? (
        <GuestRoute>
          <Component {...pageProps} />
        </GuestRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
};

export default Route;
