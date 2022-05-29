/**
 * イベント発生時に`eventState`を指定することで`ClickAwayListener`の適用を免れる
 *
 * @property shown 既に表示されていることを示す
 * */
const eventState = { shown: false };

/** イベントの種類を指定する */
export const activateEventAttr = (type: keyof typeof eventState) => {
  eventState[type] = true;
};

/** 指定したイベントの状態を戻す */
export const deactivateEventAttr = (type: keyof typeof eventState) => {
  eventState[type] = false;
};

/** @returns 既に自身が表示されている場合`true`(`openInfoBox`時に要更新) */
export const isItself = () => eventState.shown;

/** @returns 別のデータを表示する操作を行った場合`true` */
export const hasChanged = <T extends { id: string }>(prev?: T, current?: T) =>
  prev?.id !== current?.id;

/**
 * @returns `Button`及び`Popover`状態でのクリックを除外
 * @see https://developer.mozilla.org/ja/docs/Web/CSS/pointer-events
 * */
export const isIgnoredTarget = (eventTarget: HTMLElement) => {
  const isButton = () =>
    eventTarget.nodeName === 'BUTTON' ||
    eventTarget.getAttribute('role') === 'button';
  const isPopoverDisplayed = () => eventTarget.style['zIndex'] === '-1';
  const ignored = isButton() || isPopoverDisplayed();
  return ignored;
};
