<template>
  <div id="field">
    <div class="space"></div>
    <div class="hNumbers">
      <div
        v-for="h in fieldHeight"
        :key="h"
        :class="{'delimiter': !(h % 5 ||  h === fieldHeight), 'active': h === activeCell}"
      >
        <span v-for="(val, index) in fieldNumbers['h'][h-1]" :key="'cel-'+h+'-'+index">
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
        <span v-for="(val, index) in fieldNumbers['w'][w-1]" :key="'row-'+w+'-'+index">
          {{ val }}
        </span>
      </div>
    </div>

    <div class="game">
      <template v-for="w in fieldWidth">
        <div
          :key="w"
          :class="{'delimiter': !(w % 5 ||  w === fieldWidth), 'active': w === activeRow}"
        >
          <template v-for="h in fieldHeight">
            <span
              :class="[
                cellClassName(cellState(w, h)),
                !(h % 5 ||  h === fieldHeight) ? 'delimiter' : '',
                h === activeCell ? 'active': ''
              ]"
              :key="h"
              @click="toggleCellState(w, h)"
              @contextmenu.prevent="toggleCancelled(w, h)"
              @mouseover="setActiveCell(w, h)"
              class="cell"
            ></span>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
const game = {
  'h': [
    [20],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 2, 4, 1],
    [1, 2, 6, 1],
    [1, 2, 2, 2, 1],
    [1, 2, 3, 1],
    [1, 2, 4, 1],
    [1, 2, 3, 1],
    [1, 2, 3, 1],
    [1, 2, 2, 2, 3, 1],
    [1, 6, 6, 1],
    [1, 4, 4, 1],
    [1, 1],
    [20]
  ],
  'w': [
    [20],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 1],
    [1, 2, 1],
    [1, 2, 1],
    [1, 10, 1],
    [1, 9, 1],
    [1, 1],
    [1, 3, 2, 1],
    [1, 5, 3, 1],
    [1, 2, 2, 2, 1],
    [1, 2, 2, 2, 1],
    [1, 3, 6, 1],
    [1, 2, 4, 1],
    [1, 2, 1],
    [1, 1],
    [20]
  ]
};

const
  CELL_EMPTY = 0,
  CELL_FILLED = 1,
  CELL_CANCELLED = 2,
  CELL_NOTICED = 3;

export default {
  data: function () {
    return {
      fieldNumbers: game,
      filledCells: [],
      activeRow: null,
      activeCell: null
    };
  },

  computed: {
    fieldHeight: function () {
      return this.fieldNumbers['h'].length;
    },
    fieldWidth: function () {
      return this.fieldNumbers['w'].length;
    },
  },

  methods: {
    setActiveCell(x, y) {
      this.activeRow = x;
      this.activeCell = y;
    },

    toggleCellState(x, y) {
      const currentState = this.cellState(x, y);
      let newState = CELL_EMPTY;

      if (currentState === CELL_EMPTY) {
        newState = CELL_FILLED;
      }
      else if (currentState === CELL_FILLED) {
        newState = CELL_CANCELLED;
      }

      let cells = this.filledCells[x] || [];
      cells[y] = newState;

      this.$set(this.filledCells, x, cells);
    },

    toggleCancelled(x, y) {
      const currentState = this.cellState(x, y);
      let newState = currentState === CELL_CANCELLED ? CELL_EMPTY : CELL_CANCELLED;

      let cells = this.filledCells[x] || [];
      cells[y] = newState;

      this.$set(this.filledCells, x, cells);
    },

    cellState: function (x, y) {
      if (!this.filledCells[x] || !this.filledCells[x][y]) return CELL_EMPTY;
      return this.filledCells[x][y];
    },

    cellClassName: function (cellState) {
      switch (cellState) {
        case CELL_FILLED:
          return 'filled';
        case CELL_CANCELLED:
          return 'cancelled';
        case CELL_NOTICED:
          return 'noticed';
      }

      return 'empty';
    }
  }
}
</script>