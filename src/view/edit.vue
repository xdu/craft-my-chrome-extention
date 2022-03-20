<template>
  <va-form tag="form" @submit.prevent="checkFeedUrl">
    <va-input label="URL" v-model="url"/>
    <va-input label="Title" v-model="title"/>
    <va-button type="submit">Confirm</va-button>
    <va-button @click="this.$router.back()">Cancel</va-button>
  </va-form>
</template>

<script>

export default {
  data() {
    return {
      url: '',
      title: ''
    }
  },
  
  methods: {
    checkFeedUrl() {
      const self = this;

      chrome.runtime.sendMessage({ 
        action: 'feed',
        url: self.url,
        title: self.title
        }, function(response) {

          self.$store.dispatch({
            type: 'updateFeed',
            url: response.url,
            title: response.title,
            entries: response.entries
        })
        self.$router.back()
      })
    }
  }
}
</script>