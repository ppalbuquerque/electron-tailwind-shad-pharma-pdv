export const HotkeyScope = {
  SIDEBAR: 'sidebar',
  CONTENT: 'content',
  MODAL: 'modal',
  TABLE: 'table',
  FORM: 'form',
} as const

export type HotkeyScope = (typeof HotkeyScope)[keyof typeof HotkeyScope]
