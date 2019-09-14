<template>
  <div class="about container">
    <h2>{{ $t('about.how_to_play') }}</h2>
    <div v-html="$t('about.how_to_play_text')"></div>

    <h2>{{ $t('about.about_project') }}</h2>
    <div v-html="$t('about.about_project_text')"></div>
  </div>
</template>
