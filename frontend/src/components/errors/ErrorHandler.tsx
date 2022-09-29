// cf. https://nextjs.org/docs/advanced-features/custom-error-page

import Error from 'next/error';
import BadRequest from 'pages/400';

import Forbidden from 'pages/403';
import NotFound from 'pages/404';
import PageExpired from 'pages/419';
import TooManyRequests from 'pages/429';
import InternalServerError from 'pages/500';
import ServiceUnavailable from 'pages/503';

type ErrorHandlerProps = {
  httpStatus: number;
};

const ErrorHandler = ({ httpStatus }: ErrorHandlerProps) => {
  switch (httpStatus) {
    case 400:
      return <BadRequest />;
    case 403:
      return <Forbidden />;
    case 404:
    case 405:
      return <NotFound />;
    case 419:
      return <PageExpired />;
    case 429:
      return <TooManyRequests />;
    case 500:
      return <InternalServerError />;
    case 503:
      return <ServiceUnavailable />;
    default:
      return <Error statusCode={httpStatus} />;
  }
};

export default ErrorHandler;
