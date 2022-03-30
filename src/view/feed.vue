<template>
  <span>{{ this.$route.params.id }}</span>
  <va-list>
    <va-list-label>List</va-list-label>
    <va-list-item v-for="entry in entries" :key="entry.id">
      <router-link :to="{ name: 'entry', params: { id: entry.id, feed: this.$route.params.id } }">
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
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "feed",

  mounted() {
    this.fetchFeed(this.$route.params.id)
  },

  computed: {
    ...mapState({
      entries: (state) => state.entries,
    }),
  },
  methods: {
    ...mapActions(["fetchFeed"]),
  },
};
</script>
