import { HttpErrorLayout } from 'layouts';

const TooManyRequests = () => {
  return (
    <HttpErrorLayout
      title="429 Too Many Requests"
      description="規定アクセス回数を超過しました。"
      hint="時間を置いてもう一度お試しください。"
    />
  );
};

export default TooManyRequests;
