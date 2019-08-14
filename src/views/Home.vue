<template>
  <div class="home container">
    <p>Main page</p>

    <p>Go to <router-link :to="{name: 'game', params: {id: 1}}">the only available game</router-link>.</p>
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>
