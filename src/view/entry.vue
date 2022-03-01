<template>
  <div>{{ id }}</div>
  <div>{{ content.summary }}</div>
  <va-button :rounded="false" @click="back">Back</va-button>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "entry",

  mounted() {
    window.addEventListener("keydown", this.keypress);
  },

  unmounted() {
    window.removeEventListener("keydown", this.keypress);
  },

  computed: {
    id() {
      return this.$route.params.id;
    },

    content() {
      return this.entries.find((entry) => (entry.id = this.id));
    },

    ...mapState({
      entries: (state) => state.entries,
    }),
  },

  methods: {
    back() {
      this.$router.back();
    },

    keypress(e) {
      if (e.defaultPrevented) {
        return; // Should do nothing if the default action has been cancelled
      }
      if (e.code === "ArrowLeft") {
        this.back();
      }
    },
  },
};
</script>