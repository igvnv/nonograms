<template>
  <div class="home container">
    <h2>{{ $t('gamesList.title')}}</h2>

    <Loader v-if="gamesListLoadingStatus === 'loading'" />
    <div v-if="gamesListLoadingStatus === 'error'" class="errorMessage">{{ $t('gamesList.loading_error') }}</div>

    <ul id="gamesList" v-show="gamesListLoadingStatus === 'done'">
      <li
        v-for="game in gamesList"
        :key="game.id"
      >
        <router-link :to="{name: 'game', params: {id: game.id, lang: self.$i18n.locale}}">
          <span class="number">#{{ game.id}}</span>
          <span class="info">
            <span class="size">{{ game.rows.length }}x{{ game.columns.length }}</span>
            <span class="state" :class="gameState(game.id).class">{{ $t('gamesList.gameState.' + gameState(game.id).label) }}</span>
          </span>
          <span class="name">
            <span
              v-if="gameStateId(game.id) === variables.GAME_IS_FINISHED"
            >{{ game.name }}</span>
            <span
              v-if="gameStateId(game.id) !== variables.GAME_IS_FINISHED"
              v-html="$options.filters.hideText(game.name)"
              class="blurred"
            ></span>
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import variables from '../variables';
import Loader from "@/components/Loader";
import * as ActionsTypes from '../store/actions-types';

export default {
  name: 'home',
  components: {Loader},

  data: function () {
    return {
      variables: variables,
      self: this
    };
  },

  computed: {
    ...mapState(['gamesList', 'gamesListLoadingStatus', 'gamesState'])
  },

  methods: {
    gameStateId: function(gameId) {
      return this.gamesState[gameId.toString()];
    },
    gameState: function (gameId) {
      let stateId = this.gameStateId(gameId);
      return variables.GAME_STATES[stateId] || variables.GAME_STATES[variables.GAME_IS_NEW];
    },
  },

  mounted() {
    this.$store.dispatch(ActionsTypes.LOAD_GAMES);
    this.$store.dispatch(ActionsTypes.LOAD_GAMES_STATE);
  }
}
</script>
