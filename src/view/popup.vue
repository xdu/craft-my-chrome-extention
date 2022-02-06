<template>
  <div class="main_app">
    <h1>Hello {{ hello }}</h1>
    <n-list bordered>
      <n-list-item>
        <n-card :bordered="false" hoverable size="small" title="Card" @click="greet">
          Count : {{ count }} 
        </n-card>
      </n-list-item>
      <n-list-item>
        Item 2
      </n-list-item>
    </n-list>
    <n-button bordered type="info">Button</n-button>
  </div>
</template>

<script>

import { NButton, NCard, NList, NListItem } from 'naive-ui'
import { mapState } from 'vuex'

export default {
  components : {
    NButton,
    NCard,
    NListItem,
    NList
  },
  name: 'popup',
  data () {
    return {
      msg: 'popup'
    }
  },
  computed: {
    hello() {
      return "Hello, " + this.msg
    },
    ...mapState({
      count: state => state.count * 2
    })
  },
  methods: {
    greet() {
      this.$store.commit('increment')
      console.log(this.$store.state.count)
    }
  }
}

</script>

<style>
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 400px;
  height: 500px;
}

.n-list.n-list--bordered .n-list-item {
    padding: 0;
}
</style>
