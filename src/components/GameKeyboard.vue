<template>
  <div id="gameKeyboard">
    <div id="dPad">
      <button class="left" @click="arrowLeft" ref="arrowLeftButton"></button>
      <button class="right" @click="arrowRight" ref="arrowRightButton"></button>
      <button class="up" @click="arrowUp" ref="arrowUpButton"></button>
      <button class="down" @click="arrowDown" ref="arrowDownButton"></button>
    </div>

    <div id="keyboardMode">
      <button
        class="select"
        ref="cellSelectButton"
        :class="{'selected': mode === variables.KEYBOARD_MODE_SELECT}"
        @click="setMode(variables.KEYBOARD_MODE_SELECT)"
      ></button>
      <button
        class="cancel"
        ref="cellSelectCancel"
        :class="{'selected': mode === variables.KEYBOARD_MODE_CANCEL}"
        @click="setMode(variables.KEYBOARD_MODE_CANCEL)"
      ></button>
      <button
        class="clean"
        ref="cellSelectClean"
        :class="{'selected': mode === variables.KEYBOARD_MODE_CLEAN}"
        @click="setMode(variables.KEYBOARD_MODE_CLEAN)"
      ></button>
    </div>
  </div>
</template>
<script>
/**
 * Keyboard for manual control of game field. Useful for touch-devices.
 *
 * Produces events:
 * - move (with payload 'up', 'down', 'left' or 'right')
 * - select (with cell status from variables.CELL_*)
 */
import variables from "../variables";

export default {
  data: function () {
    return {
      mode: variables.KEYBOARD_MODE_SELECT,
      variables: variables
    };
  },

  /**
   * Adds keyboard listeners on keyboard create.
   */
  mounted: function () {
    document.addEventListener('keyup', this.keyListener);
  },

  /**
   * Adds keyboard listeners on keyboard remove.
   */
  destroyed: function () {
    document.removeEventListener('keyup', this.keyListener);
  },

  methods: {
    /**
     * Defines what will happen when component keyboard button is pushed.
     * @param {String} mode
     */
    setMode(mode) {
      this.mode = mode;
      this.setCellState(mode);
    },

    /**
     * Handles keystrokes on the keyboard.
     * @param {KeyboardEvent} e
     */
    keyListener: function (e) {
      let affectedButton;

      switch (e.code) {
        case 'ArrowUp':
          affectedButton = this.$refs.arrowUpButton;
          this.arrowUp();
          break;
        case 'ArrowDown':
          affectedButton = this.$refs.arrowDownButton;
          this.arrowDown();
          break;
        case 'ArrowLeft':
          affectedButton = this.$refs.arrowLeftButton;
          this.arrowLeft();
          break;
        case 'ArrowRight':
          affectedButton = this.$refs.arrowRightButton;
          this.arrowRight();
          break;
        case 'Enter':
        case 'Space':
          this.setCellState(this.mode);
          break;
      }

      if (affectedButton) {
        affectedButton.classList.add('active');
        setTimeout(() => affectedButton.classList.remove('active'), 100);
      }
    },

    /**
     * Action when the up arrow key was clicked.
     */
    arrowUp() {
      this.$emit('move', 'up');
    },

    /**
     * Action when the down arrow key was clicked.
     */
    arrowDown() {
      this.$emit('move', 'down');
    },

    /**
     * Action when the left arrow key was clicked.
     */
    arrowLeft() {
      this.$emit('move', 'left');
    },

    /**
     * Action when the right arrow key was clicked.
     */
    arrowRight() {
      this.$emit('move', 'right');
    },

    /**
     * Sets current selected cell state.
     * @param {String} mode
     */
    setCellState(mode) {
      let affectedButton;

      switch (mode) {
        case variables.KEYBOARD_MODE_SELECT:
          affectedButton = this.$refs.cellSelectButton;
          this.$emit('select', variables.CELL_FILLED);
          break;
        case variables.KEYBOARD_MODE_CANCEL:
          affectedButton = this.$refs.cellSelectCancel;
          this.$emit('select', variables.CELL_CANCELLED);
          break;
        case variables.KEYBOARD_MODE_CLEAN:
          affectedButton = this.$refs.cellSelectClean;
          this.$emit('select', variables.CELL_EMPTY);
          break;
        default:
          console.error(`Invalid keyboard mode "${mode}"`);
      }

      if (affectedButton) {
        affectedButton.classList.add('active');
        setTimeout(() => affectedButton.classList.remove('active'), 100);
      }
    }
  }
}
</script>