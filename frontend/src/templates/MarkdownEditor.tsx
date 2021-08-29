import { Fragment, useEffect, useState } from 'react';

import MDEditor, { PreviewType } from '@uiw/react-md-editor';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ObjectShape } from 'yup/lib/object';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CardActions } from '@material-ui/core';

import { mdCommands } from 'config/mdEditor';
import { SubmitButton } from 'templates';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: { boxShadow: `0 0 0 1px ${theme.palette.error.main}` },
  })
);

type MarkdownEditorProps = {
  schema: yup.ObjectSchema<ObjectShape>;
  onSubmit: (text: string) => void;
  defaultValue?: string;
};

const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  const { schema, defaultValue } = props;
  const prop = Object.keys(schema.fields)[0];
  const classes = useStyles();
  const [mode, setMode] = useState<PreviewType>('preview');
  const [value, setValue] = useState(defaultValue);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<typeof prop, string>>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  // 表示するデータが変更された場合に値を初期化する
  useEffect(() => {
    setMode('preview');
    setValue(defaultValue);
  }, [defaultValue]);

  const onSubmit = (data: Record<typeof prop, string>) => {
    setMode('preview');

    if (defaultValue === data[prop]) return;
    else props.onSubmit(data[prop]);
  };

  if (mode === 'preview')
    return (
      <CardActions onClick={() => setMode('edit')}>
        <MDEditor.Markdown source={value} />
      </CardActions>
    );

  return (
    <Fragment>
      <MDEditor
        preview={mode}
        previewOptions={{ style: { padding: '10px' } }}
        commands={mdCommands}
        value={value}
        onChange={setValue}
        textareaProps={{
          placeholder: 'Enter the text',
          ...register(prop),
        }}
        className={!!errors[prop] ? classes.error : undefined}
      />
      <CardActions>
        <span style={{ flexGrow: 1 }}>{errors[prop]?.message}</span>
        <SubmitButton onClick={handleSubmit(onSubmit)} size='small'>
          {'Save'}
        </SubmitButton>
      </CardActions>
    </Fragment>
  );
};

export default MarkdownEditor;
