<template>
  <div id="field">
    <div class="space"></div>
    <div class="hNumbers">
      <div
        v-for="h in fieldHeight"
        :key="h"
        :class="{'delimiter': !(h % 5 ||  h === fieldHeight), 'active': h === activeCell}"
      >
        <span
          v-for="(val, index) in gameField['columns'][h-1]"
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
        :class="{'delimiter': !(w % 5 ||  w === fieldWidth), 'active': w === activeRow}"
      >
        <span
          v-for="(val, index) in gameField['rows'][w-1]"
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
          :class="{'delimiter': !(w % 5 ||  w === fieldWidth), 'active': w === activeRow}"
        >
          <template v-for="h in fieldHeight">
            <span
              :class="[
                cellClassName(cellState(h, w)),
                !(h % 5 ||  h === fieldHeight) ? 'delimiter' : '',
                h === activeCell ? 'active': ''
              ]"
              :key="h"
              @mousedown.prevent="cellClick(h, w)"
              @contextmenu.prevent="toggleCancelled(h, w)"
              @mouseover="cellHover(h, w)"
              class="cell"
            ></span>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import variables from '@/variables';

export default {
  props: {
    gameField: {
      type: Object,
      required: true,
      default: function () { return {'rows': [], 'columns': []} }
    }
  },

  data: function () {
    return {
      isMouseDragging: false,
      filledCells: [],
      activeRow: null,
      activeCell: null,
      rowFilledChunks: [],
      colFilledChunks: []
    };
  },

  watch: {
    gameField: function () {
      this.rowFilledChunks = this.gameField['rows'].map(row => row.map(() => false));
      this.colFilledChunks = this.gameField['columns'].map(col => col.map(() => false));
    }
  },

  computed: {
    fieldHeight: function () {
      return this.gameField['rows'].length;
    },
    fieldWidth: function () {
      return this.gameField['columns'].length;
    },
    isFinished: function () {
      return this.rowFilledChunks.every(chunk => chunk[0] === true) && this.colFilledChunks.every(chunk => chunk[0] === true);
    }
  },

  methods: {
    cellClick(x, y) {
      this.toggleCellState(x, y);
      this.isMouseDragging = true
    },

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

    checkLine(line, selected) {
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

    checkFilled(x, y) {
      let
        row = this.gameField['rows'][y - 1],
        column = this.gameField['columns'][x - 1],
        columnFilled = this.getFilledSubsequences(this.filledCells[x] || []),
        rowFilled = this.getFilledSubsequences(this.filledCells.map(cell => cell[y] || variables.CELL_EMPTY));

      this.$set(this.rowFilledChunks, y - 1, this.checkLine(row, rowFilled));
      this.$set(this.colFilledChunks, x - 1, this.checkLine(column, columnFilled));

      // Row is done!
      if (this.checkLine(row, rowFilled).every(n => n)) {
        for (let i=1; i<=this.gameField['rows'].length; ++i) {
          if (!this.filledCells[i] || this.filledCells[i][y] !== variables.CELL_FILLED) {
            let cells = this.filledCells[i] || [];
            cells[y] = variables.CELL_CANCELLED;
            this.$set(this.filledCells, i, cells);
          }
        }
      }

      // Column is done!
      if (this.checkLine(column, columnFilled).every(n => n)) {
        let cells = this.filledCells[x];
        for (let i=1; i<=this.gameField['columns'].length; ++i) {
          if (cells[i] !== variables.CELL_FILLED) {
            cells[i] = variables.CELL_CANCELLED;
          }
        }

        this.$set(this.filledCells, x, cells);
      }
    },

    cellHover(x, y) {
      this.activeCell = x;
      this.activeRow = y;

      if (this.isMouseDragging && this.cellState(x, y) === variables.CELL_EMPTY) {
        this.toggleCellState(x, y);
      }
    },

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

    setCellState(x, y, newState) {
      let cells = this.filledCells[x] || [];
      cells[y] = newState;

      this.$set(this.filledCells, x, cells);
      this.checkFilled(x, y);
    },

    toggleCancelled(x, y) {
      const currentState = this.cellState(x, y);
      let newState = currentState === variables.CELL_CANCELLED ? variables.CELL_EMPTY : variables.CELL_CANCELLED;

      this.setCellState(x, y, newState);
    },

    cellState: function (x, y) {
      if (!this.filledCells[x] || !this.filledCells[x][y]) return variables.CELL_EMPTY;
      return this.filledCells[x][y];
    },

    cellClassName: function (cellState) {
      switch (cellState) {
        case variables.CELL_FILLED:
          return 'filled';
        case variables.CELL_CANCELLED:
          return 'cancelled';
        case variables.CELL_NOTICED:
          return 'noticed';
      }

      return 'empty';
    }
  }
}
</script>