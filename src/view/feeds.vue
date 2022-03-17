<template>
  <va-list>
    <va-list-label>Feeds</va-list-label>
    <va-list-item v-for="feed in feeds" :key="feed.id">
      <va-list-item-section>
        <va-list-item-label>{{ feed.title }}</va-list-item-label>
      </va-list-item-section>
    </va-list-item>
  </va-list>
  <va-button :rounded="false" @click="this.$router.back()">Back</va-button>
  <router-link :to="{ name: 'edit' }">
    <va-button :rounded="false">Add</va-button>
  </router-link>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "feeds",

  computed: {
    ...mapState({
      feeds: (state) => state.sources,
    })
  }
};
</script>>