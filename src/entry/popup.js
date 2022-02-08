import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from '../view/popup.vue'
import { VuesticPlugin } from 'vuestic-ui'

const store = createStore({
    state() {
        return {
            count: 0
        }
    },
    mutations: {
        increment(state) {
            state.count ++
        }
    }
})

createApp(App)
    .use(VuesticPlugin)
    .use(store)
    .mount('#app')
