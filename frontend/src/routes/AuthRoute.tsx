// cf. https://dev.to/ivandotv/protecting-static-pages-in-next-js-application-1e50
// cf. https://github.com/ivandotv/nextjs-client-signin-logic

import { useEffect } from 'react';
import { useRouter } from 'next/router';

import store from 'store';
import { clearHttpStatus, setFlash } from 'store/slices';
import { fetchAuthUser } from 'store/thunks/auth';
import { isReady } from 'utils/auth';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { Loading } from 'layouts';

export type AuthPage = {
  auth: true;
};

type AuthRouteProps = {
  children: React.ReactNode;
};

const AuthRoute = ({ children }: AuthRouteProps) => {
  const router = useRouter();
  const httpStatus = useAppSelector((state) => state.app.httpStatus);
  const signedIn = useAppSelector((state) => state.auth.signedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isReady()) {
      dispatch(fetchAuthUser());
      return;
    }

    if (!signedIn) router.replace('/login');
  }, [dispatch, signedIn, router]);

  useEffect(() => {
    if (httpStatus !== 401) return;

    dispatch({ type: fetchAuthUser.rejected.type });
    dispatch(setFlash({ type: 'error', message: 'ログインしてください。' }));
    sessionStorage.setItem('previousUrl', router.asPath);
  }, [dispatch, httpStatus, router.asPath]);

  useEffect(() => {
    return function cleanup() {
      if (store.getState().app.httpStatus === 401) dispatch(clearHttpStatus());
    };
  }, [dispatch]);

  // Until initialized or the redirect completed.
  if (!isReady() || !signedIn) return <Loading open={true} />;
  else return <>{children}</>;
};

export default AuthRoute;
