<template>
  <va-form tag="form" @submit.prevent="checkFeedUrl">
    <va-list>
      <va-list-label> Feeds URL </va-list-label>
      <va-list-item v-for="item in feeds" :key="item.index">
        <va-checkbox v-model="item.active"/>
        <va-list-item-section>
          <va-input label="URL" v-model="item.url" />
        </va-list-item-section>
        <va-button-group>
            <va-button icon="close" size="small" @click="remove(item)"/>
            <va-button icon="refresh" size="small" @click="refresh(item)" />
          </va-button-group>
      </va-list-item>
      <va-list-label>
        <va-button @click="add" icon="add" size="small" />
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
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      url: "",
    };
  },

  mounted() {
    this.init()
  },

  computed: {
    ...mapState({
      feeds: (state) => state.sources,
    }),
  },

  methods: {

    ...mapActions(["init"]),

    remove(item) {
      const idx = this.feeds.findIndex((e) => e.id === item.id)
      console.log("remove item : " + idx)
      if (idx !== -1) {
        this.feeds.splice(idx, 1)
        this.save()
      }
    },

    add() {
      this.feeds.push({ url: "", active: true, id: Date.now() });
      this.save()
    },

    save() {
      this.$store.dispatch({
        type: "updateSources",
        sources: this.feeds,
      });
    },

    refresh(item) {
      const self = this;

      chrome.runtime.sendMessage(
        {
          action: "feed",
          url: item.url,
          title: item.url,
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
          }
        }
      );
    },

    checkFeedUrl() {
      const self = this;

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