<template>
  <header>
    <h1>
      <span id="logo">
        <span @click="toggleLogoCell" ref="cell1"></span>
        <span @click="toggleLogoCell" ref="cell2"></span>
        <span @click="toggleLogoCell" ref="cell3"></span>
        <span @click="toggleLogoCell" ref="cell4" class="cancelled"></span>
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

      let iconName = 'favicon-';
      for (let i=1;i<=4;++i) {
        iconName += this.$refs[`cell${i}`].classList.contains('cancelled') ? 'x' : 'o';
      }

      document.querySelector('link[rel=icon]').href = `${iconName}.png`;
    }
  }
}
</script>