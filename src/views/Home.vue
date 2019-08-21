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
        <span class="size">{{ game.columns.length }}x{{ game.rows.length }}</span>
        <span class="name">{{ game.name }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';

export default {
  name: 'home',

  data: function () {
    return {};
  },

  computed: {
    ...mapState(['gamesList', 'gamesListLoadingStatus'])
  },

  methods: {
    ...mapActions(['loadGames']),
  },

  mounted() {
    this.loadGames();
  }
}
</script>
