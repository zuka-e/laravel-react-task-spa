import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppDispatch } from 'utils/hooks';
import { verifyEmail } from 'store/thunks/auth';
import { BaseLayout } from 'layouts';

const VerifyEmail = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const url = window.location.pathname + window.location.search;
      const response = await dispatch(verifyEmail({ url }));

      if (verifyEmail.rejected.match(response))
        return history.replace('/account');

      history.replace('/');
    })();
  }, [dispatch, history]);

  return <BaseLayout subtitle="Verify Email"></BaseLayout>;
};

export default VerifyEmail;
