import { Fragment, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ObjectShape } from 'yup/lib/object';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CardActions } from '@material-ui/core';

import { mdCommands } from 'config/mdEditor';
import { SubmitButton } from 'templates';

import type { MDEditorProps, PreviewType } from '@uiw/react-md-editor';
import type { MarkdownPreviewProps } from '@uiw/react-markdown-preview';

/**
 * When used with `import MDEditor`, the following error occurred.
 * ```text
 * Error [ERR_REQUIRE_ESM]: require() of ES Module ~/react-markdown/index.js
 * from ~/@uiw/react-markdown-preview/lib/index.js not supported.
 * Instead change the require of ~/react-markdown/index.js
 * in ~/@uiw/react-markdown-preview/lib/index.js
 * to a dynamic import() which is available in all CommonJS modules.
 * ```
 * To solve it,
 * @see https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
 * @see https://github.com/uiwjs/react-md-editor/issues/224#issuecomment-907679744
 */
const MDEditor = dynamic<MDEditorProps>(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

/**
 * When used with `<MDEditor.Markdown>`, the error occurred.
 * @see https://github.com/uiwjs/react-md-editor/issues/224#issuecomment-1030261498
 */
const MarkdownPreview = dynamic<MarkdownPreviewProps>(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    previewBox: {
      '&:hover': {
        boxShadow: `0 0 0 1px ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
      },
    },
    error: { boxShadow: `0 0 0 1px ${theme.palette.error.main}` },
    helperText: {
      flexGrow: 1,
      '&.error': { color: theme.palette.error.main },
    },
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
  const [mode, setMode] = useState<PreviewType>(
    defaultValue ? 'preview' : 'edit'
  );
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
    setMode(defaultValue ? 'preview' : 'edit');
    setValue(defaultValue);
  }, [defaultValue]);

  const handleClick = () => setMode('edit');

  const onSubmit = (data: Record<typeof prop, string>) => {
    data[prop] && setMode('preview');

    if (defaultValue === data[prop]) return;
    else props.onSubmit(data[prop]);
  };

  if (mode === 'preview' && defaultValue)
    return (
      <CardActions onClick={handleClick} className={classes.previewBox}>
        <MarkdownPreview source={value} />
      </CardActions>
    );

  return (
    <Fragment>
      <MDEditor
        autoFocus
        preview={mode}
        previewOptions={{ style: { padding: '10px' } }}
        commands={mdCommands}
        value={value}
        onChange={setValue}
        textareaProps={{
          placeholder: 'Enter the text',
          name: register(prop)['name'],
          onBlur: register(prop)['onBlur'],
        }}
        className={errors[prop] ? classes.error : undefined}
      />
      <CardActions>
        <span
          className={`${classes.helperText}${errors[prop] ? ' error' : ''}`}
        >
          {errors[prop]?.message}
        </span>
        <SubmitButton onClick={handleSubmit(onSubmit)} size="small">
          {'Save'}
        </SubmitButton>
      </CardActions>
    </Fragment>
  );
};

export default MarkdownEditor;
