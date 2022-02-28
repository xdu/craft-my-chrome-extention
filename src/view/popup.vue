<template>
  <div class="main_app">
    <h1>{{ hello }}</h1>
    <va-list>
      <va-list-label>List</va-list-label>
      <va-list-item v-for="entry in entries" :key="entry.id">
        <router-link to="/entry">
        <va-list-item-section>
          <va-list-item-label>{{ entry.title }}</va-list-item-label>
          <va-list-item-label caption :lines=2>
            {{ entry.summary }}
          </va-list-item-label>
        </va-list-item-section>
        </router-link>
      </va-list-item>
    </va-list>
    <va-button :rounded="false" @click="fetchFeed">Click me</va-button>
    <router-view></router-view>
  </div>
</template>

<script>
import "vuestic-ui/dist/vuestic-ui.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import { mapActions, mapState } from "vuex";

export default {
  name: "popup",
  data() {
    return {
      msg: "popup",
    };
  },
  computed: {
    hello() {
      return "Hello, " + this.msg;
    },
    ...mapState({
      count: (state) => state.count,
      entries : (state) => state.entries
    }),
  },
  methods: {
    greet() {
      this.$store.commit("increment");
    },
    ...mapActions([
      'fetchFeed'
    ])
  },
};
</script>

<style>
.main_app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  width: 400px;
  height: 500px;
}
html body {
  min-height: unset;
}
</style>
