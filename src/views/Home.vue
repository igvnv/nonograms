<template>
  <div class="home container">
    <h2>Choose your game!</h2>

    <ul id="gamesList">
      <li
        v-for="game in gamesList"
        :key="game.id"
      >
        <router-link :to="{name: 'game', params: {id: game.id}}">
        <span class="number">#{{ game.id}}</span>
        <span class="info">
          <span class="size">{{ game.columns.length }}x{{ game.rows.length }}</span>
          <span class="state" :class="gameState(game.id).class">{{ gameState(game.id).label }}</span>
        </span>
        <span class="name">{{ game.name }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import variables from '../variables';
import * as ActionsTypes from '../store/actions-types';

export default {
  name: 'home',

  data: function () {
    return {};
  },

  computed: {
    ...mapState(['gamesList', 'gamesListLoadingStatus', 'gamesState'])
  },

  methods: {
    gameState: function (gameId) {
      let stateId = this.gamesState[gameId.toString()];
      return variables.GAME_STATES[stateId] || variables.GAME_STATES[variables.GAME_IS_NEW];
    },
  },

  mounted() {
    this.$store.dispatch(ActionsTypes.LOAD_GAMES);
    this.$store.dispatch(ActionsTypes.LOAD_GAMES_STATE);
  }
}
</script>
