<template>
  <div id="chooseLanguage" class="container">
    <h2>Please choose your language</h2>
    <ul class="languages">
      <li><button @click="chooseLanguage('ru')">Русский</button></li>
      <li><button @click="chooseLanguage('en')">English</button></li>
    </ul>
  </div>
</template>
<script>
export default {
  methods: {
    chooseLanguage(language) {
      this.$router.push({name: 'home', params: {lang: language}});
    }
  }
};
</script>