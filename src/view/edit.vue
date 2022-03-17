<template>
  <va-form tag="form" @submit.prevent="checkFeedUrl">
    <va-input label="URL" v-model="url"/>
    <va-button type="submit">Confirm</va-button>
    <va-button @click="this.$router.back()">Cancel</va-button>
  </va-form>
</template>

<script>

export default {
  data() {
    return {
      url: ''
    }
  },
  
  methods: {
    checkFeedUrl() {
      this.$store.dispatch("addFeed", this.url)
        .then(() => this.$router.back())
        .catch(err => alert(err))
    }
  }
}
</script>