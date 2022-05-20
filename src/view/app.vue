<template>
  <div class="main_app">
    <router-view></router-view>
  </div>
</template>

<script>
import "vuestic-ui/dist/vuestic-ui.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import { mapActions } from "vuex";

export default {
  mounted() {
    this.init();
  },

  methods: {
    ...mapActions(["init"]),
  },
};
</script>

<style>
.main_app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 5px;
  width: 400px;
  height: 420px;
}
html body {
  min-height: unset;
}
img {
  height: auto !important;
  max-width: 100% !important;
}
</style>