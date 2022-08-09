import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useAppDispatch } from 'utils/hooks';
import { verifyEmail } from 'store/thunks/auth';
import { BaseLayout } from 'layouts';

const VerifyEmail = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const url = location.pathname + location.search;
      const response = await dispatch(verifyEmail({ url }));

      if (verifyEmail.rejected.match(response))
        return history.replace('/account');

      history.replace('/');
    })();
  }, [dispatch, history]);

  return <BaseLayout subtitle="Verify Email"></BaseLayout>;
};

export default VerifyEmail;
