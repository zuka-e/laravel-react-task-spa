import { HttpErrorLayout } from 'layouts';

const InternalServerError = () => {
  return (
    <HttpErrorLayout
      title="500 Internal Server Error"
      description="このページは現在動作していません。"
    />
  );
};

export default InternalServerError;
