import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

type LabeledSelectProps = {
  label: string;
  options: object;
  selectedValue: string;
  onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
};
const LabeledSelect: React.FC<LabeledSelectProps> = (props) => {
  const { label, options, selectedValue, onChange } = props;
  const classes = useStyles();

  const htmlId = 'filter';
  const labelId = htmlId + '-label';

  return (
    <FormControl className={classes.root}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={htmlId}
        value={selectedValue}
        onChange={onChange}
      >
        {Object.values(options).map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LabeledSelect;
