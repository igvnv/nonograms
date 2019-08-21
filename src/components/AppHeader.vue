<template>
  <header>
    <h1>
      <span id="logo">
        <span @click="toggleLogoCell"></span>
        <span @click="toggleLogoCell"></span>
        <span @click="toggleLogoCell"></span>
        <span @click="toggleLogoCell" class="cancelled"></span>
      </span>
      Nonograms
    </h1>

    <nav>
      <router-link :to="{name: 'home'}">Home</router-link> |
      <router-link :to="{name: 'about'}">About</router-link>
    </nav>
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