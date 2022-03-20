<template>
  <h1>{{ hello }}</h1>
  <va-list>
    <va-list-label>List</va-list-label>
    <va-list-item v-for="entry in entries" :key="entry.id">
      <router-link :to="{ name: 'entry', params: { id: entry.id } }">
        <va-list-item-section>
          <va-list-item-label>{{ entry.title }}</va-list-item-label>
          <va-list-item-label caption :lines="2">
            <span v-html="entry.summary"></span>
          </va-list-item-label>
        </va-list-item-section>
      </router-link>
    </va-list-item>
  </va-list>
  <va-button :rounded="false" @click="fetchFeed">Update</va-button>
  <router-link :to="{ name: 'feeds' }">
    <va-button :rounded="false">Feeds</va-button>
  </router-link>
  <router-view></router-view>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "popup",

  mounted() {
    this.init();
  },

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
      entries: (state) => state.entries,
    }),
  },
  methods: {
    greet() {
      this.$store.commit("increment");
    },
    ...mapActions(["fetchFeed", "init"]),
  },
};
</script>
