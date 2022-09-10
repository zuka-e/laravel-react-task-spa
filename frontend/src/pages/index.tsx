import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { fetchAuthUser } from 'store/thunks/auth';
import { isReady } from 'utils/auth';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { BaseLayout, Loading } from 'layouts';
import { Hero, Features } from 'components/home/LandingPage';

const Home = () => {
  const router = useRouter();
  const signedIn = useAppSelector((state) => state.auth.signedIn);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isReady()) dispatch(fetchAuthUser());
  }, [dispatch]);

  useEffect(() => {
    signedIn && router.replace(`users/${userId}/boards`);
  }, [router, signedIn, userId]);

  // Until initialized or the redirect completed.
  if (!isReady() || signedIn) return <Loading open={true} />;

  return (
    <BaseLayout subtitle="">
      <Hero />
      <Features />
    </BaseLayout>
  );
};

export default Home;
