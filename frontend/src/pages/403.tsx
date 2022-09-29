import { HttpErrorLayout } from 'layouts';

const Forbidden = () => {
  return (
    <HttpErrorLayout
      title="403 Forbidden"
      description="不正なリクエストです。"
    />
  );
};

export default Forbidden;
