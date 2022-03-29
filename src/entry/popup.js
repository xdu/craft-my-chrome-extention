import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter, createWebHashHistory} from 'vue-router'
import { VuesticPlugin } from 'vuestic-ui'

import App from '../view/app.vue'
import Feed from '../view/feed.vue'
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
            state.sources = [...list]
        }
    },
    actions:{
        init(context) {
            chrome.storage.local.get(['sources'], (result) => {
                context.commit('sources', result.sources)
            })
        },

        updateFeed(context, payload) {
            
            chrome.storage.local.get(['sources'], (result) => {

                let ident = Date.now()

                if (! result.sources) {
                    let sources = [{ 
                        id : ident,
                        url: payload.url, 
                        title: payload.title
                    }]
                    chrome.storage.local.set({ 'sources' : sources }, function() {
                        context.commit('sources', sources)
                    })
                } else if (! result.sources.find(e => e.url === payload.url)) {
                    let sources = [... result.sources]
                    sources.push({ 
                        id: ident,
                        url: payload.url, title: payload.title 
                    })
                    chrome.storage.local.set({ 'sources' : sources }, function() {
                        context.commit('sources', sources)
                    })
                }

                chrome.storage.local.set({ [ident] : payload.entries }, function() {
                    context.commit('feed', payload.entries)
                })

            })
        },

        fetchFeed(context, id) {
            console.log("fetching feed " + id)
            chrome.storage.local.get([id], function(result) {
                context.commit('feed', result[id])
            })
        }
    }
})

const routes = [
    { path: '/', component: Feeds },
    { path: '/feed/:id', name: 'feed', component: Feed},
    { path: '/entry/:id', name: 'entry', component: Entry },
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
