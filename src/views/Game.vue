<template>
  <div id="game" class="container">
    <div v-show="!gameData">Game is loading...</div>
    <GameField v-if="gameData" :gameField="gameData" />
  </div>
</template>

<script>
import GameField from '@/components/GameField';
import {mapState} from 'vuex';

export default {
  components: {GameField},
  computed: {
    ...mapState(['gameData'])
  },
  methods: {
    loadGame: async function (gameId) {
      await this.$store.dispatch('loadGameData', gameId);
    }
  },
  mounted() {
    this.loadGame(this.$route.params.id);
  }
}
</script>
