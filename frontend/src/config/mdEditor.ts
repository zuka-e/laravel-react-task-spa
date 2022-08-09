/**
 * When used with `import { commands } from '@uiw/react-md-editor'`,
 * the following error occurred.
 * `Error [ERR_REQUIRE_ESM]: require() of ES Module ~ not supported.`
 * To solve it,
 * @see https://github.com/uiwjs/react-md-editor/issues/224#issuecomment-925673338
 */
import * as commands from '@uiw/react-md-editor/lib/commands';

/** @see https://uiwjs.github.io/react-md-editor/#custom-toolbars */
export const titleCommand = commands.group(
  [
    commands.title1,
    commands.title2,
    commands.title3,
    commands.title4,
    commands.title5,
    commands.title6,
  ],
  {
    name: 'title',
    groupName: 'title',
    buttonProps: {
      'aria-label': 'Insert title',
      title: 'Insert title',
    },
  }
);

// デフォルトの並び順は以下を参照
// node_modules/@uiw/react-md-editor/lib/commands/getCommands
export const mdCommands: commands.ICommand[] = [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.hr,
  titleCommand,
  commands.divider,
  commands.link,
  commands.quote,
  commands.code,
  commands.codeBlock,
  commands.image,
  commands.divider,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.checkedListCommand,
];
