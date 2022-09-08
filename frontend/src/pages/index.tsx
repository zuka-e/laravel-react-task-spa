import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';

import { isSignedIn } from 'utils/auth';
import { useAppSelector } from 'utils/hooks';
import { BaseLayout } from 'layouts';
import { Hero, Features } from 'components/home/LandingPage';

const LandingPage = () => (
  <Fragment>
    <Hero />
    <Features />
  </Fragment>
);

const renderHome = () => {
  if (isSignedIn()) {
    // return <Dashboard />;
  } else {
    return <LandingPage />;
  }
};

const Home = () => {
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    isSignedIn() && router.replace(`users/${userId}/boards`);
  }, [router, userId]);

  return <BaseLayout subtitle="">{renderHome()}</BaseLayout>;
};

export default Home;
