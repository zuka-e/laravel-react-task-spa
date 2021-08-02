import React, { useEffect, useState } from 'react';

import moment from 'moment';
import {
  KeyboardDateTimePicker,
  KeyboardDateTimePickerProps,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

type DatetimeInputProps = {
  onChange: (date?: Date) => void;
} & Omit<KeyboardDateTimePickerProps, 'onChange'>;

/**
 * @see https://material-ui-pickers.dev/demo/datetime-picker#inline-mode
 * @see https://material-ui-pickers.dev/api/KeyboardDateTimePicker
 */
const DatetimeInput: React.FC<DatetimeInputProps> = (props) => {
  const { value, onChange, ...keyboardDatetimePickerProps } = props;
  const [datetime, setDatetime] = useState<MaterialUiPickersDate>(
    value ? moment(value) : null
  );

  // 表示するデータが変更された場合に値を初期化する
  useEffect(() => {
    setDatetime(value ? moment(value) : null);
  }, [value]);

  /** state`datetime`が変更された場合にデータの更新を実行 */
  const handleClose = () => {
    if (moment(value).unix() === datetime?.unix()) return;
    props.onChange(datetime?.toDate());
  };

  return (
    <KeyboardDateTimePicker
      variant='inline'
      format='YYYY/MM/DD/ HH:mm'
      ampm={false}
      minDate={new Date().valueOf()}
      minDateMessage='' // デフォルトのメッセージを削除
      // autoOk : `分`設定後自動で(`onChange`実行前に)閉じる
      value={datetime}
      onChange={setDatetime}
      onClose={handleClose}
      onError={console.log}
      {...keyboardDatetimePickerProps}
    />
  );
};

export default DatetimeInput;
