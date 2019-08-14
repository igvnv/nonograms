<template>
  <div id="game" class="container">
    <p>Time to play!</p>

    <GameField />
  </div>
</template>

<script>
import GameField from '@/components/GameField';

export default {
  components: {GameField}
}
</script>
