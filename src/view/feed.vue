<template>
  <va-list>
    <va-list-label>{{ title }}</va-list-label>
    <va-list-item v-for="entry in entries" :key="entry.id">
      <router-link :to="{ name: 'entry', params: { id: entry.id, feed: this.$route.params.id } }">
        <va-list-item-section>
          <va-list-item-label :lines="2">{{ entry.title }}</va-list-item-label>
        </va-list-item-section>
      </router-link>
    </va-list-item>
  </va-list>
  <va-button :rounded="false" @click="fetchFeed">Update</va-button>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "feed",

  mounted() {
    this.fetchFeed(this.$route.params.id)
  },

  computed: {

    title() {
      let feedId = this.$route.params.id 
      let feed = this.sources.find(e => e.id === feedId)
      return feed ? feed.title : "List"
    },

    ...mapState({
      entries: (state) => state.entries,
      sources: (state) => state.sources
    }),
  },
  methods: {
    ...mapActions(["fetchFeed"]),
  },
};
</script>
