import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
} from '@material-ui/core';

import theme from 'theme';

const makeColor = (color: LabeledSelectProps['color']) => {
  switch (color) {
    case 'secondary':
      return theme.palette.secondary.main;
    case 'contrastP':
      return theme.palette.primary.contrastText;
    case 'contrastS':
      return theme.palette.secondary.contrastText;
    default:
      return theme.palette.primary.main;
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    label: {
      fontWeight: 'bold',
      '&.MuiFormLabel-root.Mui-focused': {
        color: (props: LabeledSelectProps) => makeColor(props.color),
      },
    },
    input: {
      '&.MuiInput-underline:after': {
        borderColor: (props: LabeledSelectProps) => makeColor(props.color),
      },
    },
  })
);

type LabeledSelectProps = {
  color?: 'primary' | 'secondary' | 'contrastP' | 'contrastS';
  label: string;
  options: object;
  selectedValue: string;
  onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
};

const LabeledSelect: React.FC<LabeledSelectProps> = (props) => {
  const { label, options, selectedValue, onChange } = props;
  const classes = useStyles(props);

  const htmlId = 'filter';
  const labelId = htmlId + '-label';

  return (
    <FormControl className={classes.root}>
      <InputLabel id={labelId} className={classes.label}>
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        id={htmlId}
        value={selectedValue}
        onChange={onChange}
        input={<Input className={classes.input} />}
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
