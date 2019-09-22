<template>
  <div id="gameFieldWrapper" ref="fieldLayout" :style="cssVariables">
    <div id="field" ref="gameField">
      <div class="space"></div>
      <div class="hNumbers">
        <div
          v-for="h in fieldHeight"
          :key="h"
          :class="{'delimiter': !(h % 5 ||  h === fieldHeight), 'hovered': h === activeColumn}"
        >
          <span
            v-for="(val, index) in gameData['columns'][h-1]"
            :key="'cel-'+h+'-'+index"
            :class="{'filled': colFilledChunks[h - 1] && colFilledChunks[h - 1][index]}"
          >
            {{ val }}
          </span>
        </div>
      </div>

      <div class="wNumbers">
        <div
          v-for="w in fieldWidth"
          :key="w"
          :class="{'delimiter': !(w % 5 ||  w === fieldWidth), 'hovered': w === activeRow}"
        >
          <span
            v-for="(val, index) in gameData['rows'][w-1]"
            :key="'row-'+w+'-'+index"
            :class="{'filled': rowFilledChunks[w - 1] && rowFilledChunks[w - 1][index]}"
          >
            {{ val }}
          </span>
        </div>
      </div>

      <div class="game" @mouseleave="isMouseDragging = false" @mouseup="isMouseDragging = false">
        <template v-for="w in fieldWidth">
          <div
            :key="w"
            :class="{'delimiter': !(w % 5 ||  w === fieldWidth), 'hovered': w === activeRow}"
          >
            <template v-for="h in fieldHeight">
              <span
                :class="[
                  cellClassName(cellState(h, w)),
                  !(h % 5 ||  h === fieldHeight) ? 'delimiter' : '',
                  h === activeColumn ? 'hovered': '',
                  h === activeColumn && w === activeRow && controlledByKeyboard ? 'active': ''
                ]"
                :key="h"
                @mousedown.prevent="onCellClick(h, w)"
                @contextmenu.prevent="toggleCancelled(h, w)"
                @mouseover="onCellHover(h, w)"
                class="cell"
              ></span>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import variables from '@/variables';
import * as ActionsTypes from '../store/actions-types';

export default {
  props: {
    gameData: {
      type: Object,
      required: true,
      default: function () { return {'id': -1, 'rows': [], 'columns': []} }
    },
    gameProcess: {
      type: Array,
      default: function () { return []; }
    },
    controlledByKeyboard: {
      type: Boolean,
      default: function () { return false; }
    }
  },

  data: function () {
    return {
      isMouseDragging: false,
      filledCells: [],
      activeRow: null,
      activeColumn: null,
      rowFilledChunks: [],
      colFilledChunks: [],
      cellSize: 20
    };
  },

  watch: {
    gameField: function () {
      this.rowFilledChunks = this.gameData['rows'].map(row => row.map(() => false));
      this.colFilledChunks = this.gameData['columns'].map(col => col.map(() => false));
    },

    gameProcess: function (val) {
      this.filledCells = val;

      for (let i = 1; i <= this.fieldHeight; ++i) {
        this.updateFilledState(1, i, false);
      }

      for (let i = 1; i <= this.fieldWidth; ++i) {
        this.updateFilledState(i, 1, false);
      }
    },
    controlledByKeyboard: function (val) {
      if ( val && !this.activeColumn && !this.activeRow) {
        this.activeColumn = 1;
        this.activeRow = 1;
      }
    }
  },

  computed: {
    fieldHeight: function () {
      return this.gameData['rows'].length;
    },
    fieldWidth: function () {
      return this.gameData['columns'].length;
    },
    isFinished: function () {
      return this.rowFilledChunks.every(row => row.every(chunk => chunk === true))
        && this.colFilledChunks.every(column => column.every(chunk => chunk === true));
    },
    /** Responsive design through CSS variables */
    cssVariables: function () {
      return {
        '--cell-height': `${this.cellSize}px`,
        '--cell-width': `${this.cellSize}px`,
        '--cell-font-size': `${Math.floor(this.cellSize * .6)}px`
      };
    }
  },

  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.adjustFieldToScreen);
    });
  },

  destroyed() {
    window.removeEventListener('resize', this.adjustFieldToScreen);
  },

  methods: {
    /**
     * Adjusts the game fields' size depending on the screen size.
     */
    adjustFieldToScreen() {
      // We must wait until keyboard will be added to or removed from layout.
      this.$nextTick(() => {
        let
          layoutWidth = this.$refs.fieldLayout.clientWidth,
          layoutHeight = this.$refs.fieldLayout.clientHeight;

        let
          gameVisibleHeight = document.getElementById('app').clientHeight,
          gameFullHeight = document.getElementById('app').scrollHeight;

        // Global layout has vertical scroll
        if (gameFullHeight > gameVisibleHeight) {
          layoutHeight -= gameFullHeight - gameVisibleHeight;
        }

        let
          gameVisibleWidth = document.getElementById('app').clientWidth,
          gameFullWidth = document.getElementById('app').scrollWidth;

        // Global layout has horizontal scroll
        if (gameFullWidth > gameVisibleWidth) {
          layoutWidth -= gameFullWidth - gameVisibleWidth;
        }

        const
          gameFieldWidth = this.$refs.gameField.scrollWidth,
          gameFieldHeight = this.$refs.gameField.scrollHeight,

          widthRatio = layoutWidth / gameFieldWidth,
          heightRatio = layoutHeight / gameFieldHeight,

          ratio = Math.min(widthRatio, heightRatio);

        this.cellSize = Math.floor(this.cellSize * ratio);
      });
    },

    /**
     * Handles click on a game field's cell.
     * @param {number} x
     * @param {number} y
     */
    onCellClick(x, y) {
      this.toggleCellState(x, y);
      this.isMouseDragging = true
    },

    /**
     * Handles mouse hover on a game field's cell.
     * @param {number} x
     * @param {number} y
     */
    onCellHover(x, y) {
      this.activeColumn = x;
      this.activeRow = y;

      if (this.isMouseDragging && this.cellState(x, y) === variables.CELL_EMPTY) {
        this.toggleCellState(x, y);
      }
    },

    /**
     * Returns list of filled subsequences (that has `variables.CELL_FILLED` value) length.
     *
     * Example:
     * [0, 1, 0, 1, 1, 1] => [1, 3]
     *
     * @param {[number]} line
     * @return {[number]}
     */
    getFilledSubsequences(line) {
      let
        checkedLine = [...line],
        subsequences = [],
        acc = 0;

      do {
        let n = checkedLine.shift();

        if (n === variables.CELL_FILLED) ++acc;
        else if (acc > 0) {
          subsequences.push(acc);
          acc = 0;
        }
      }
      while (checkedLine.length);

      if (acc) subsequences.push(acc);

      return subsequences;
    },

    /**
     * Returns which subsequences are filled.
     *
     * Example:
     * ([1, 2, 3, 1], [1, 2, 3]) => [true, true, true, false]
     *
     * @param {[number]} line
     * @param {[number]} selected
     * @return {[boolean]}
     */
    checkFilledSubsequences(line, selected) {
      if (!selected.length || selected.length > line.length) {
        return line.map(() => false);
      }

      let
        searchStack = line.filter(n => selected.includes(n)),
        selectedStack = selected.filter(n => searchStack.includes(n));

      return line.map(n => {
        if (!selectedStack.length) return false;

        let next = selectedStack.indexOf(n);

        if (next === -1) return false;

        selectedStack = selectedStack.slice(next + 1);
        return true;
      });
    },

    /**
     * Updates filled subsequences for row and column.
     * When `fillCellsOnDone` is true, sets all not filled cells as cancelled when current line is done.
     * @param {number} x
     * @param {number} y
     * @param {boolean} fillCellsOnDone
     */
    updateFilledState(x, y, fillCellsOnDone = true) {
      let
        row = this.gameData['rows'][y - 1],
        column = this.gameData['columns'][x - 1],
        columnFilled = this.getFilledSubsequences(this.filledCells[x] || []),
        rowFilled = this.getFilledSubsequences(this.filledCells.map(cell => cell[y] || variables.CELL_EMPTY));

      this.$set(this.rowFilledChunks, y - 1, this.checkFilledSubsequences(row, rowFilled));
      this.$set(this.colFilledChunks, x - 1, this.checkFilledSubsequences(column, columnFilled));

      if (fillCellsOnDone) {
        // Row is done!
        if (this.checkFilledSubsequences(row, rowFilled).every(n => n)) {
          for (let i = 1; i <= this.gameData['rows'].length; ++i) {
            if (!this.filledCells[i] || this.filledCells[i][y] !== variables.CELL_FILLED) {
              let cells = this.filledCells[i] || [];
              cells[y] = variables.CELL_CANCELLED;
              this.$set(this.filledCells, i, cells);
            }
          }
        }

        // Column is done!
        if (this.checkFilledSubsequences(column, columnFilled).every(n => n)) {
          let cells = this.filledCells[x];
          for (let i = 1; i <= this.gameData['columns'].length; ++i) {
            if (cells[i] !== variables.CELL_FILLED) {
              cells[i] = variables.CELL_CANCELLED;
            }
          }

          this.$set(this.filledCells, x, cells);
        }
      }
    },

    /**
     * Moves active cell to `direction`. Works when user uses keyboard (`controlledByKeyboard` is true).
     * @param {String} direction
     */
    moveActiveCell(direction) {
      switch (direction) {
        case 'down':
          this.activeRow = this.activeRow >= this.fieldHeight ? 1 : this.activeRow + 1;
          break;
        case 'up':
          this.activeRow = this.activeRow <= 1 ? this.fieldHeight : this.activeRow - 1;
          break;
        case 'left':
          this.activeColumn = this.activeColumn <= 1 ? this.fieldWidth : this.activeColumn - 1;
          break;
        case 'right':
          this.activeColumn = this.activeColumn >= this.fieldWidth ? 1 : this.activeColumn + 1;
          break;
      }
    },

    /**
     * Changes cell state depends on its current state.
     * Examples:
     * - empty -> filled
     * - filled -> empty
     * @param {number} x
     * @param {number} y
     */
    toggleCellState(x, y) {
      const currentState = this.cellState(x, y);
      let newState = variables.CELL_EMPTY;

      if (currentState === variables.CELL_EMPTY) {
        newState = variables.CELL_FILLED;
      }
      else if (currentState === variables.CELL_FILLED) {
        newState = variables.CELL_CANCELLED;
      }

      this.setCellState(x, y, newState);
    },

    /**
     * Sets state for current active cell. Uses by parent component when user uses keyboard.
     * @param {number} newState
     */
    setActiveCellState(newState) {
      this.setCellState(this.activeColumn, this.activeRow, newState);
    },

    /**
     * Sets state for cell.
     * @param {number} x
     * @param {number} y
     * @param {number} newState
     */
    setCellState(x, y, newState) {
      let cells = this.filledCells[x] || [];
      cells[y] = newState;

      this.$set(this.filledCells, x, cells);
      this.updateFilledState(x, y);

      this.$store.dispatch(ActionsTypes.SET_GAME_STATE, {
        id: this.$props.gameData['id'],
        state: this.isFinished ? variables.GAME_IS_FINISHED : variables.GAME_IN_PROCESS
      });

      this.$store.dispatch(ActionsTypes.SAVE_GAME_PROCESS, {
        id: this.$props.gameData['id'],
        cells: this.filledCells
      });
    },

    /**
     * Toggles cancelled state for cell. Works when user click right mouse button on a cell.
     * @param {number} x
     * @param {number} y
     */
    toggleCancelled(x, y) {
      const currentState = this.cellState(x, y);
      let newState = currentState === variables.CELL_CANCELLED ? variables.CELL_EMPTY : variables.CELL_CANCELLED;

      this.setCellState(x, y, newState);
    },

    /**
     * Returns cell state.
     * @param {number} x
     * @param {number} y
     * @return {number}
     */
    cellState: function (x, y) {
      if (!this.filledCells[x] || !this.filledCells[x][y]) return variables.CELL_EMPTY;
      return this.filledCells[x][y];
    },

    /**
     * Returns CSS class name for state.
     * @param {number} cellState
     * @return {string}
     */
    cellClassName: function (cellState) {
      switch (cellState) {
        case variables.CELL_FILLED:
          return 'filled';
        case variables.CELL_CANCELLED:
          return 'cancelled';
      }

      return 'empty';
    }
  }
}
</script>