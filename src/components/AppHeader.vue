<template>
  <header>
    <h1>
      <span id="logo">
        <span @click="toggleLogoCell" ref="cell1"></span>
        <span @click="toggleLogoCell" ref="cell2"></span>
        <span @click="toggleLogoCell" ref="cell3"></span>
        <span @click="toggleLogoCell" ref="cell4" class="cancelled"></span>
      </span>
      <router-link :to="{name: 'home'}">Nonograms</router-link>
    </h1>

    <nav ref="navbar" v-show="this.$router.currentRoute.name !== 'choose_language'">
      <span class="burger" @click="menuOpened = !menuOpened" :class="{opened: menuOpened}"><span></span></span>

      <ul class="headerMenu" :class="{opened: menuOpened}">
        <li><router-link :to="{name: 'home'}">{{ $t('header.home') }}</router-link></li>
        <li><router-link :to="{name: 'about'}">{{ $t('header.about') }}</router-link></li>
        <li>
          <div class="dropdown">
            <span class="label">{{ $t('header.language') }}</span>
            <ul>
              <li @click="changeLanguage('en')" :class="{active: this.$i18n.locale === 'en'}">English</li>
              <li @click="changeLanguage('ru')" :class="{active: this.$i18n.locale === 'ru'}">Русский</li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>
<script>
let menuEventListener;

export default {
  data: function () {
    return {
      menuOpened: false
    };
  },
  methods: {
    /**
     * Changes logo cells like it is a small game field.
     * Also changes favicon according to logo state.
     * @param {MouseEvent} event
     */
    toggleLogoCell(event) {
      event.target.classList.toggle('cancelled');

      let iconName = 'favicon-';
      for (let i=1;i<=4;++i) {
        iconName += this.$refs[`cell${i}`].classList.contains('cancelled') ? 'x' : 'o';
      }

      /** @type HTMLLinkElement */
      const iconElement = document.querySelector('link[rel=icon]');
      if (iconElement) {
        iconElement.href = `${iconName}.png`;
      }
    },
    /**
     * Relocates to the current page for chosen language.
     * @param {String} language
     */
    changeLanguage: function (language) {
      let toRoute = {...this.$router.currentRoute};

      // "Page not found"
      if (toRoute.name === 'not_found') {
        toRoute = {name: 'home', params: {}};
      }

      toRoute.params.lang = language;
      this.$router.push(toRoute);
    }
  },
  watch: {
    /**
     * Add click listener on document when menu is open to close menu after click out of #navbar element.
     */
    menuOpened: function (open) {
      if (open) {
        let self = this;
        menuEventListener = document.addEventListener('click', /** @type MouseEvent */ function (event) {
          if (!self.$refs.navbar.contains(event.target)) {
            self.menuOpened = false;
            document.removeEventListener('click', menuEventListener);
          }
        });
      }
      else if (menuEventListener) {
        document.removeEventListener('click', menuEventListener);
      }
    }
  }
}
</script>