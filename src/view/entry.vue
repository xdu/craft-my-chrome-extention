<template>
  <div class="entry"> 
    <div class='entry_source'><va-button @click="back" size="small" icon="reply"/>{{ content.source }}</div>
    <div class='entry_title'>{{ content.title }}</div>
    <div class='entry_date'>{{ displayDate }}</div>
    <div class='entry_content' v-html="content.summary"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import dayjs from 'dayjs'

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
    this.entries[this.index].read = true
  },

  unmounted() {
    window.removeEventListener("keydown", this.keypress);
    this.updateArticles(this.entries)
  },

  computed: {
    ...mapState({
      entries: (state) => state.entries,
    }),

    content() {
      return this.entries[this.index]
    },

    displayDate() {
      return dayjs(this.content.date)
    }
  },

  methods: {

    ... mapActions([ "updateArticles" ]),

    next() {
      if (this.index < this.entries.length - 1) {
        this.index ++
        this.entries[this.index].read = true
      }
    },

    prev() {
      if (this.index > 0) {
        this.index --
        this.entries[this.index].read = true
      }
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