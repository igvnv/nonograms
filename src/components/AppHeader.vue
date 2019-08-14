<template>
  <header>
    <div id="logo">
      <span @click="toggleLogoCell"></span>
      <span @click="toggleLogoCell"></span>
      <span @click="toggleLogoCell"></span>
      <span @click="toggleLogoCell" class="cancelled"></span>
    </div>

    <div id="nav">
      <router-link :to="{name: 'home'}">Home</router-link> |
      <router-link :to="{name: 'about'}">About</router-link>
    </div>
  </header>
</template>
<script>
export default {
  methods: {
    toggleLogoCell(event) {
      event.target.classList.toggle('cancelled');
    }
  }
}
</script>