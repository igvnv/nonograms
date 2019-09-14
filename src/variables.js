export default Object.freeze({
  CELL_EMPTY:     0,
  CELL_FILLED:    1,
  CELL_CANCELLED: 2,

  GAME_IS_NEW: 0,
  GAME_IN_PROCESS: 1,
  GAME_IS_FINISHED: 2,

  GAME_STATES: {
    0: {'class': 'new', 'label': 'new_game'},
    1: {'class': 'inProcess', 'label': 'in_process'},
    2: {'class': 'finished', 'label': 'finished'},
  },

  GAME_MODE_MOUSE: 1,
  GAME_MODE_KEYBOARD: 2,

  KEYBOARD_MODE_SELECT: 1,
  KEYBOARD_MODE_CANCEL: 2,
  KEYBOARD_MODE_CLEAN: 3,
});