<template>
  <div id="game" class="container">
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

    <GameField
      v-if="gameData"
      ref="gameField"
      :gameData="gameData"
      :gameProcess="gameProcess"
      :controlledByKeyboard="gameMode === variables.GAME_MODE_KEYBOARD"
    />

    <div class="actions">
      <button @click="restart" :disabled="gameState === newGameStatus">Restart the game</button>
    </div>

    <div class="modes">
      <button
        :class="{'selected': gameMode === variables.GAME_MODE_MOUSE}"
        @click="gameMode = variables.GAME_MODE_MOUSE"
      >Mouse</button>
      <button
        :class="{'selected': gameMode === variables.GAME_MODE_KEYBOARD}"
        @click="gameMode = variables.GAME_MODE_KEYBOARD"
      >Keyboard</button>
    </div>

    <GameKeyboard
      v-if="gameMode === variables.GAME_MODE_KEYBOARD"
      @move="moveActiveCell($event)"
      @select="selectActiveCell($event)"
    />
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
      newGameStatus: variables.GAME_IS_NEW,
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
