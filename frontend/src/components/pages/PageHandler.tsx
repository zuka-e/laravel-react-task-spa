import { useEffect } from 'react';
import type { AppProps } from 'next/app';

import store from 'store';
import { clearHttpStatus } from 'store/slices';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { Route } from 'routes';
import { ErrorHandler } from 'components/errors';
import { useRouter } from 'next/router';

const isHttpError = (httpStatus: number) => {
  return 400 <= httpStatus && httpStatus < 600;
};

const isRenderableError = (httpStatus: number) => {
  const excludedStatuses = [401];
  return isHttpError(httpStatus) && !excludedStatuses.includes(httpStatus);
};

const PageHandler = (props: Pick<AppProps, 'Component' | 'pageProps'>) => {
  const router = useRouter();
  const httpStatus = useAppSelector((state) => state.app.httpStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return function cleanup() {
      // Use `store` to prevent duplicate running (cf. `useSelector`)
      if (store.getState().app.httpStatus) dispatch(clearHttpStatus());
    };
  }, [dispatch, router.asPath]);

  if (httpStatus && isRenderableError(httpStatus))
    return <ErrorHandler httpStatus={httpStatus} />;

  return <Route {...props} />;
};

export default PageHandler;
