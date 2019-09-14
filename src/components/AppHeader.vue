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

    <nav v-show="this.$router.currentRoute.name !== 'choose_language'">
      <router-link :to="{name: 'home'}">{{ $t('header.home') }}</router-link> |
      <router-link :to="{name: 'about'}">{{ $t('header.about') }}</router-link> |
      <span class="dropdown">
        <span class="label">{{ $t('header.language') }}</span>
        <ul>
          <li @click="changeLanguage('en')" :class="{active: this.$i18n.locale === 'en'}">English</li>
          <li @click="changeLanguage('ru')" :class="{active: this.$i18n.locale === 'ru'}">Русский</li>
        </ul>
      </span>
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
    },
    changeLanguage: function (language) {
      let toRoute = {...this.$router.currentRoute};

      // "Page not found"
      if (toRoute.name === 'not_found') {
        toRoute = {name: 'home', params: {}};
      }

      toRoute.params.lang = language;
      this.$router.push(toRoute);
    }
  }
}
</script>