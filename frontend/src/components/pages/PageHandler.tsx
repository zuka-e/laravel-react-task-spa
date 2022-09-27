import type { AppProps } from 'next/app';

import { Route } from 'routes';

const PageHandler = (props: Pick<AppProps, 'Component' | 'pageProps'>) => {
  return <Route {...props} />;
};

export default PageHandler;
