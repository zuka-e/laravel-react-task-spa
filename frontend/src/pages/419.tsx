import { HttpErrorLayout } from 'layouts';

const PageExpired = () => {
  return (
    <HttpErrorLayout
      title="419 Page Expired"
      description="ページの有効期限が切れました。"
      hint="もう一度お試しください。"
    />
  );
};

export default PageExpired;
