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

    <GameField v-if="gameData" :gameData="gameData" :gameProcess="gameProcess" />

    <div class="actions">
      <button @click="restart" :disabled="gameState === newGameStatus">Restart the game</button>
    </div>
  </div>
</template>

<script>
import GameField from '@/components/GameField';
import {mapState} from 'vuex';
import variables from "../variables";
import * as ActionsTypes from '../store/actions-types';

export default {
  components: {GameField},
  data: function () {
    return {
      gameId: null,
      newGameStatus: variables.GAME_IS_NEW,
      showDonePopup: false,
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
