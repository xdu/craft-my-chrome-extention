<template>
  <va-list>
    <va-list-label>Feeds</va-list-label>
    <va-list-item v-for="feed in feeds" :key="feed.id" :to="{ name: 'feed', params: { id: feed.id }}">
      <va-list-item-section>
        <va-list-item-label>{{ feed.title }}</va-list-item-label>
      </va-list-item-section>
    </va-list-item>
  </va-list>
  <router-link :to="{ name: 'edit' }">
    <va-button :rounded="false">Add</va-button>
  </router-link>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "feeds",

  mounted() {
    this.init()
  },

  computed: {
    ...mapState({
      feeds: (state) => state.sources,
    })
  },

  methods: {
    ...mapActions(["init"]),
  },
};
</script>>