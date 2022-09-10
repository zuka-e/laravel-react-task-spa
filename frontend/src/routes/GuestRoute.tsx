// cf. file://./AuthRoute.tsx

import { Loading } from 'layouts';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { fetchAuthUser } from 'store/thunks/auth';
import { isAfterRegistration, isReady } from 'utils/auth';
import { useAppDispatch, useAppSelector } from 'utils/hooks';

export type GuestPage = {
  guest: true;
};

type GuestRouteProps = {
  children: React.ReactNode;
};

const GuestRoute = ({ children }: GuestRouteProps) => {
  const router = useRouter();
  const signedIn = useAppSelector((state) => state.auth.signedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isReady()) dispatch(fetchAuthUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAfterRegistration()) {
      router.replace('/email-verification');
      return;
    }

    if (signedIn) {
      const previousUrl = sessionStorage.getItem('previousUrl');
      sessionStorage.removeItem('previousUrl');
      router.replace(previousUrl || '/');
    }
  }, [router, signedIn]);

  // Until initialized or the redirect completed.
  if (!isReady() || signedIn) return <Loading open={true} />;
  else return <>{children}</>;
};

export default GuestRoute;
