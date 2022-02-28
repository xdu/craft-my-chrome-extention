import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter, createWebHashHistory} from 'vue-router'
import { VuesticPlugin } from 'vuestic-ui'

import App from '../view/popup.vue'
import Entry from '../view/post.vue'

const store = createStore({
    state() {
        return {
            count: 0,
            entries: []
        }
    },
    mutations: {
        increment(state) {
            state.count ++
        },
        feed(state, list) {
            state.entries = [...list]
        }
    },
    actions:{
        fetchFeed(context) {
            fetch('https://rss.dw.com/atom/rss-chi-all')
                .then(resp => resp.text())
                .then(xml => {
                    const parser = new DOMParser()
                    const doc = parser.parseFromString(xml, 'text/xml')
                    const list = []

                    const entries = doc.getElementsByTagName('entry')
                    for(let i = 0; i < entries.length; i ++) {

                        const entry = entries[i]
                        const json = {}

                        json.id = entry.getElementsByTagName('id')[0].firstChild.nodeValue
                        json.title = entry.getElementsByTagName('title')[0].firstChild.nodeValue
                        json.summary = entry.getElementsByTagName('summary')[0].firstChild.nodeValue

                        list.push(json)
                    }

                    context.commit('feed', list)
                })
        }
    }
})

const Home = { template: '<div>Home</div>' }
const About = { template: '<div>About</div>' }

const routes = [
    { path: '/', component: Home },
    { path: '/About', component: About },
    { path: '/entry', component: Entry }
  ]

  const router = createRouter({
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
  })

createApp(App)
    .use(router)
    .use(VuesticPlugin)
    .use(store)
    .mount('#app')
