<template>
  <va-list>
    <va-list-label>Articles</va-list-label>
    <va-list-item v-for="e in articles" :key="e.id">
      <router-link :to="{ name: 'entry', params: { id: e.id, feed: this.$route.params.id } }">
        <va-list-item-section>
          <va-list-item-label :lines="2">{{ e.title }}</va-list-item-label>
          <va-list-item-label caption>{{ dayjs(e.date).fromNow() }}</va-list-item-label>
        </va-list-item-section>
      </router-link>
    </va-list-item>
  </va-list>
  <va-button :rounded="false" @click="fetchFeed">Update</va-button>
  <router-link :to="{ name: 'edit' }">
    <va-button :rounded="false">Add</va-button>
  </router-link>
</template>

<script>
import { mapActions, mapState } from "vuex";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs'

export default {
  name: "articles",

  created() {
    dayjs.extend(relativeTime);
    this.dayjs = dayjs
  },

  mounted() {
    this.fetchFeed()
  },

  computed: {
    ...mapState({
      articles: (state) => state.entries,
    }),
  },

  methods: {
    ...mapActions(["fetchFeed"]),
  },
};
</script>
