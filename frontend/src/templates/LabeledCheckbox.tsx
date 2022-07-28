import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { FormControlLabel, Checkbox, CheckboxProps } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: { color: theme.palette.text.hint },
  })
);

type LabeledCheckboxProps = {
  label: string;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
} & CheckboxProps;

const LabeledCheckbox: React.FC<LabeledCheckboxProps> = (props) => {
  const { label, checked, setChecked, ...checkboxProps } = props;
  const classes = useStyles();

  const handleChange = () => {
    props.setChecked(!props.checked);
  };

  return (
    <div>
      <FormControlLabel
        classes={{ root: classes.label }}
        label={props.label}
        control={
          <Checkbox
            onChange={handleChange}
            color="primary"
            size="small"
            {...checkboxProps}
          />
        }
      />
    </div>
  );
};

export default LabeledCheckbox;
