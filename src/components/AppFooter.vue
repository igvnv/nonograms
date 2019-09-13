<template>
  <footer>© 2019, v {{ appVersion }}</footer>
</template>
<script>
export default {
  data: function () {
    return {
      appVersion: process.env.VUE_APP_VERSION
    };
  }
}
</script>