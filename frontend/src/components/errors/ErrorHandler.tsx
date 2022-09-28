// cf. https://nextjs.org/docs/advanced-features/custom-error-page

import Error from 'next/error';

import NotFound from 'pages/404';

type ErrorHandlerProps = {
  httpStatus: number;
};

const ErrorHandler = ({ httpStatus }: ErrorHandlerProps) => {
  switch (httpStatus) {
    case 404:
    case 405:
      return <NotFound />;
    default:
      return <Error statusCode={httpStatus} />;
  }
};

export default ErrorHandler;
