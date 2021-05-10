import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Checkbox, FormControlLabel } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.hint,
    },
  })
);

type LabeledCheckboxProps = {
  color?: 'primary' | 'secondary';
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};

const LabeledCheckbox: React.FC<LabeledCheckboxProps> = (props) => {
  const { children, color, state, setState } = props;
  const classes = useStyles();

  const handleVisiblePassword = () => {
    setState(!state);
  };

  return (
    <div>
      <FormControlLabel
        className={classes.root}
        label={children}
        control={
          <Checkbox
            size='small'
            color={color || 'primary'}
            checked={state}
            onChange={handleVisiblePassword}
          />
        }
      />
    </div>
  );
};

export default LabeledCheckbox;
