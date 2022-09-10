import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';

import { useAppDispatch, useRoute } from 'utils/hooks';
import { verifyEmail } from 'store/thunks/auth';
import { BaseLayout } from 'layouts';
import type { AuthPage } from 'routes';

type VerifyEmailProps = AuthPage;

export const getStaticProps: GetStaticProps<VerifyEmailProps> = async () => {
  return {
    props: {
      auth: true,
    },
    revalidate: 10,
  };
};

const VerifyEmail = () => {
  const router = useRouter();
  const route = useRoute();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const url = route.pathname + (route.queryString || '');
      const response = await dispatch(verifyEmail({ url }));

      if (verifyEmail.rejected.match(response))
        return router.replace('/account');

      router.replace('/');
    })();
  }, [dispatch, route.pathname, route.queryString, router]);

  return <BaseLayout subtitle="Verify Email"></BaseLayout>;
};

export default VerifyEmail;
