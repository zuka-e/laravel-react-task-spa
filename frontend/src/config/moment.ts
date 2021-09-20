import moment from 'moment';
import 'moment/locale/ja';

moment.updateLocale('ja', {
  calendar: { sameElse: 'YYYY年MM月DD日 dddd HH:mm' },
  invalidDate: '日付が表示できません',
});
