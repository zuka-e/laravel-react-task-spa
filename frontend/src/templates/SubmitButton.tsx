import { Button } from '@material-ui/core';

import { useAppSelector } from 'utils/hooks';

type SubmitButtonProps = {
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary';
  fullWidth?: boolean;
};

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { children, variant, color, fullWidth } = props;
  const { loading } = useAppSelector((state) => state.auth);

  return (
    <Button
      disabled={loading}
      type='submit'
      variant={variant || 'contained'}
      color={color || 'primary'}
      fullWidth={fullWidth}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
