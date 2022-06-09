<template>
  <va-form tag="form">
    <va-list>
      <va-list-label> Feeds URL </va-list-label>
      <va-list-item v-for="item in feeds" :key="item.index">
        <va-checkbox v-model="item.active" />
        <va-list-item-section>
          <va-input label="URL" v-model="item.url" />
          <va-list-item-label caption>
            {{ dayjs(item.lastUpdate).format() }}
          </va-list-item-label>
        </va-list-item-section>
        <va-button-group>
          <va-button icon="close" size="small" @click="remove(item)" />
          <va-button icon="refresh" size="small" @click.prevent="refresh(item)" />
        </va-button-group>
      </va-list-item>
      <va-list-label>
        <router-link :to="{ name: 'feed' }">
          <va-button icon="reply" size="small">Back</va-button>
        </router-link>
        <va-button @click="add" icon="add" size="small">Add</va-button>
      </va-list-label>
    </va-list>
  </va-form>
</template>

<script>
import { mapState } from "vuex";
import dayjs from 'dayjs'

export default {
  data() {
    return {
      url: "",
    };
  },
  
  created() {
    this.dayjs = dayjs;
  },

  computed: {
    ...mapState({
      feeds: (state) => state.sources,
    }),
  },

  methods: {

    remove(item) {
      const idx = this.feeds.findIndex((e) => e.id === item.id);
      console.log("remove item : " + idx);
      if (idx !== -1) {
        this.feeds.splice(idx, 1);
        this.save();
      }
    },

    add() {
      this.feeds.push({ url: "", active: true, id: Date.now() });
      this.save();
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

  },
};
</script>