<template>
  <div>{{ content.summary }}</div>
  <va-button :rounded="false" @click="back">Back</va-button>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "entry",

  data() {
    return {
      index : 0,
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
      if (e.defaultPrevented) {
        return; // Should do nothing if the default action has been cancelled
      }
      if (e.code === "ArrowLeft") {
        this.back();
      } else if (e.code === "ArrowDown") {
        this.next();
      } else if (e.code == "ArrowUp") {
        this.prev();
      }
    },
  },
};
</script>