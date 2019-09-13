<template>
  <div id="game" class="container" :class="{'hasKeyboard': gameMode === variables.GAME_MODE_KEYBOARD}">
    <div class="done" v-if="showDonePopup">
      <p>Congratulations! Game is finished!</p>
      <div class="buttons">
        <button @click="showDonePopup = false">Continue</button>
        <router-link :to="{name: 'home'}"><button>Go to Games list</button></router-link>
      </div>
    </div>
    <div
      class="doneBackground"
      v-if="showDonePopup"
      @click="showDonePopup = false"
    ></div>

    <div v-show="!gameData">Game is loading...</div>

    <div class="gameField">
      <GameField
        v-if="gameData"
        ref="gameField"
        :gameData="gameData"
        :gameProcess="gameProcess"
        :controlledByKeyboard="gameMode === variables.GAME_MODE_KEYBOARD"
      />
    </div>

    <div class="controls" v-if="gameData">
      <div class="buttons">
        <button
          :disabled="gameState === variables.GAME_IS_NEW"
          @click="restart"
        ><span class="restartIcon"></span>Restart</button>
        <button
          :class="{'selected': gameMode === variables.GAME_MODE_KEYBOARD}"
          @click="gameMode = gameMode === variables.GAME_MODE_KEYBOARD ? variables.GAME_MODE_MOUSE : variables.GAME_MODE_KEYBOARD"
        ><span class="keyboardIcon"></span>Keyboard</button>
      </div>

      <GameKeyboard
        v-if="gameMode === variables.GAME_MODE_KEYBOARD"
        @move="moveActiveCell($event)"
        @select="selectActiveCell($event)"
      />
    </div>
  </div>
</template>

<script>
import GameField from '@/components/GameField';
import GameKeyboard from '@/components/GameKeyboard';
import {mapState} from 'vuex';
import variables from "../variables";
import * as ActionsTypes from '../store/actions-types';

export default {
  components: {GameField, GameKeyboard},
  data: function () {
    return {
      gameId: null,
      gameMode: variables.GAME_MODE_MOUSE,
      showDonePopup: false,
      variables: variables
    };
  },
  computed: {
    ...mapState(['gameData', 'gameProcess']),
    gameState: function () {
      return this.$store.getters.gameState(this.gameId);
    }
  },
  watch: {
    gameState: function (newVal, oldVal) {
      if (oldVal && newVal !== oldVal && newVal === variables.GAME_IS_FINISHED) {
        this.showDonePopup = true;
      }
    },
    gameMode: function () {
      this.$refs.gameField.adjustFieldToScreen();
    }
  },
  methods: {
    moveActiveCell: function(direction) {
      this.$refs.gameField.moveActiveCell(direction);
    },

    selectActiveCell: function(state) {
      this.$refs.gameField.setActiveCellState(state);
    },

    loadGame: async function (gameId) {
      this.gameId = gameId;

      await this.$store.dispatch(ActionsTypes.LOAD_GAME_DATA, gameId);
      await this.$store.dispatch(ActionsTypes.LOAD_GAME_PROCESS, gameId);

      this.$refs.gameField.adjustFieldToScreen();
    },
    restart: async function () {
      await this.$store.dispatch(ActionsTypes.SAVE_GAME_PROCESS, {id: this.gameId, cells: []});
      await this.$store.dispatch(ActionsTypes.LOAD_GAME_PROCESS, this.gameId);
    }
  },
  mounted() {
    this.loadGame(this.$route.params.id);
  }
}
</script>
