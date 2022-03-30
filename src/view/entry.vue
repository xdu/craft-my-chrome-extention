<template>
  <div>
    <div>{{ source }}</div>
    <p><span>{{ content.title }}</span></p>
    <p>{{ pubDate }}</p>
    <span v-html="content.summary"></span>
  </div>
  <va-button :rounded="false" @click="back">Back</va-button>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "entry",

  data() {
    return {
      index : 0,
      feed : null
    }
  },

  mounted() {
    window.addEventListener("keydown", this.keypress);

    this.index = this.entries.findIndex(entry => entry.id === this.$route.params.id);
    this.feed = this.sources.find(feed => feed.id.toString() === this.$route.params.feed)
  },

  unmounted() {
    window.removeEventListener("keydown", this.keypress);
  },

  computed: {
    ...mapState({
      entries: (state) => state.entries,
      sources: (state) => state.sources
    }),

    pubDate() {
      return new Date(this.entries[this.index].date)
    },

    content() {
      return this.entries[this.index]
    },

    source() {
      return this.feed ? this.feed.title : ""
    }
  },

  methods: {

    next() {
      if (this.index < this.entries.length - 1) this.index ++
    },

    prev() {
      if (this.index > 0) this.index --
    },

    back() {
      this.$router.back();
    },

    keypress(e) {
      // if (e.defaultPrevented) {
      //   return; // Should do nothing if the default action has been cancelled
      // }
      if (e.code === "ArrowLeft") {
        this.back();
      } else if (e.code === "ArrowDown") {
        e.preventDefault()
        this.next();
        window.scrollTo({ top:0 })
      } else if (e.code == "ArrowUp") {
        e.preventDefault()
        this.prev();
        window.scrollTo({ top:0 })
      }
    },
  },
};
</script>