import { Button } from '@material-ui/core';
import { useAppSelector } from '../store/hooks';

type SubmitButtonProps = {
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary';
};

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { children, variant, color } = props;
  const { loading } = useAppSelector((state) => state.auth);

  return (
    <Button
      disabled={loading}
      type='submit'
      variant={variant || 'contained'}
      color={color || 'primary'}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
