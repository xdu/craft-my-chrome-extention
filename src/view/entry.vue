<template>
  <div class="entry">
    <div class='entry_source'>{{ content.source }}</div>
    <div class='entry_title'>{{ content.title }}</div>
    <div class='entry_date'>{{ content.date }}</div>
    <div class='entry_content' v-html="content.summary"></div>
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
  },

  unmounted() {
    window.removeEventListener("keydown", this.keypress);
  },

  computed: {
    ...mapState({
      entries: (state) => state.entries,
    }),

    content() {
      return this.entries[this.index]
    },
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

<style>
.entry {
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 500;
  margin-left: 1em;
  margin-right: 1em;
}

.entry_source {
  font-size: 0.7rem;
  margin-block-end: 2em;
}

.entry_title {
  font-size: 1.25rem;
  margin-block-end: 2em;
}

.entry_date {
  font-size: 0.7rem;
  margin-block-end: 2em;
}

.entry_content {
  margin-block-end: 2em;
}

</style>