<template>
  <div id="game" class="container" :class="{'hasKeyboard': gameMode === variables.GAME_MODE_KEYBOARD}">
    <div class="done" v-if="showDonePopup">
      <p>{{ $t('game.game_is_finished') }}</p>
      <div class="buttons">
        <button @click="showDonePopup = false">{{ $t('game.continue_game') }}</button>
        <router-link :to="{name: 'home', params: {lang: this.$i18n.locale}}"><button>{{ $t('game.go_to_games_list') }}</button></router-link>
      </div>
    </div>
    <div
      class="doneBackground"
      v-if="showDonePopup"
      @click="showDonePopup = false"
    ></div>

    <div v-if="loadingError" class="errorMessage">{{ $t('game.loading_error') }}</div>

    <Loader v-if="!gameData && !loadingError" />

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
        ><span class="restartIcon"></span>{{ $t('game.restart') }}</button>
        <button
          :class="{'selected': gameMode === variables.GAME_MODE_KEYBOARD}"
          @click="gameMode = gameMode === variables.GAME_MODE_KEYBOARD ? variables.GAME_MODE_MOUSE : variables.GAME_MODE_KEYBOARD"
        ><span class="keyboardIcon"></span>{{ $t('game.keyboard') }}</button>
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
import Loader from "@/components/Loader";
import {mapState} from 'vuex';
import variables from "../variables";
import * as ActionsTypes from '../store/actions-types';

export default {
  components: {GameField, GameKeyboard, Loader},
  data: function () {
    return {
      loadingError: false,
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
      this.loadingError = false;

      try {
        await this.$store.dispatch(ActionsTypes.LOAD_GAME_DATA, gameId);
        await this.$store.dispatch(ActionsTypes.LOAD_GAME_PROCESS, gameId);

        this.$refs.gameField.adjustFieldToScreen();
      }
      catch (e) {
        console.error(e);
        this.loadingError = true;
      }
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
