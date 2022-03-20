import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter, createWebHashHistory} from 'vue-router'
import { VuesticPlugin } from 'vuestic-ui'

import App from '../view/app.vue'
import Popup from '../view/popup.vue'
import Entry from '../view/entry.vue'
import Feeds from '../view/feeds.vue'
import Edit from '../view/edit.vue'

const store = createStore({
    state() {
        return {
            count: 0,
            entries: [],
            sources: []
        }
    },
    mutations: {
        increment(state) {
            state.count ++
        },
        feed(state, list) {
            state.entries = [...list]
        },
        sources(state, list) {
            state.sources = list
        }
    },
    actions:{
        init(context) {
            chrome.storage.local.get(['entries', 'sources'], (result) => {
                context.commit('feed', result.entries)
                context.commit('sources', result.sources)
            })
        },

        updateFeed(context, payload) {
            
            chrome.storage.local.get(['sources'], (result) => {

                let sources = []
                if (! result.sources) {
                    sources = [{ url: payload.url, title: payload.title }]
                } else if (! result.sources.find(e => e.url === payload.url)) {
                    sources = result.sources.push({ url: payload.url, title: payload.title })
                }

                chrome.storage.local.set({ 'sources' : sources }, function() {
                    context.commit('sources', sources)
                })

                chrome.storage.local.set({ 'entries' : payload.entries }, function() {
                    context.commit('feed', payload.entries)
                })

            })
        },

        fetchFeed(context) {
            chrome.storage.local.set({ 'entries': [] }, function() {
                context.commit('feed', [])
            })
        }
    }
})

const routes = [
    { path: '/', component: Popup },
    { path: '/entry/:id', name: 'entry', component: Entry },
    { path: '/feeds', name: 'feeds', component: Feeds },
    { path: '/edit', name: 'edit', component: Edit }
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
