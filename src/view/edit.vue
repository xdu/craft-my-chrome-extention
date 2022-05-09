<template>
  <va-form tag="form" @submit.prevent="checkFeedUrl">
    <va-list>
      <va-list-label> Feeds URL </va-list-label>
      <va-list-item v-for="item in feeds" :key="item.index">
        <va-list-item-section>
          <va-input label="URL" v-model="item.url" />
        </va-list-item-section>
      </va-list-item>
      <va-list-label>
        <va-button @click="add">
          <va-icon name="add" size="small" />
        </va-button>
      </va-list-label>
    </va-list>

  <va-input label="URL" v-model="url" />
    <va-button-group>
      <va-button type="submit"><va-icon name="save" size="small" /></va-button>
      <router-link :to="{ name: 'feed' }">
        <va-button><va-icon name="close" size="small" /></va-button>
      </router-link>
    </va-button-group>
  </va-form>
</template>

<script>

import { mapState } from "vuex";

export default {
  data() {
    return {
      url: ""
    };
  },

  computed: {
    ...mapState({
      feeds: (state) => state.sources,
    }),
  },

  methods: {

    add() {
      this.feeds.push({ url : '' })
    },

    checkFeedUrl() {
      const self = this;

      self.$store.dispatch({
        type: "updateSources", sources: this.feeds
      })

      chrome.runtime.sendMessage(
        {
          action: "feed",
          url: self.url,
          title: self.title,
        },
        function (response) {
          console.log("response function called.");
          if (response) {
            self.$store.dispatch({
              type: "updateFeed",
              url: response.url,
              title: response.title,
              entries: response.entries,
            });
            self.$router.back();
          }
        }
      );
    },
  },
};
</script>