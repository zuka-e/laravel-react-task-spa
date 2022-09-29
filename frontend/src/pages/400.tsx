import { HttpErrorLayout } from 'layouts';

const BadRequest = () => {
  return (
    <HttpErrorLayout
      title="400 Bad Request"
      description="不正なリクエストです。"
    />
  );
};

export default BadRequest;
