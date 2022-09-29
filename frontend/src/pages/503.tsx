import { HttpErrorLayout } from 'layouts';

const ServiceUnavailable = () => {
  return (
    <HttpErrorLayout
      title="503 Service Unavailable"
      description="このページは現在動作していません。"
      hint="時間を置いてもう一度お試しください。"
    />
  );
};

export default ServiceUnavailable;
