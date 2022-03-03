import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter, createWebHashHistory} from 'vue-router'
import { VuesticPlugin } from 'vuestic-ui'

import App from '../view/app.vue'
import Popup from '../view/popup.vue'
import Entry from '../view/entry.vue'

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
        init(context) {
            chrome.storage.local.get(['entries'], (result) => {
                context.commit('feed', result.entries)
            })
        },

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

                    chrome.storage.local.set({ 'entries': list }, function(list) {
                        context.commit('feed', list)
                    })
                })
        }
    }
})

const routes = [
    { path: '/', component: Popup },
    { path: '/entry/:id', name: 'entry', component: Entry }
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
