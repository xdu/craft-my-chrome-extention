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

        addFeed(context, url, name) {
            let sources = []

            chrome.storage.local.get(['sources'], (result) => {
                if (result.sources) {
                    sources = [... result.sources]
                }

                fetch(url)
                .then(resp => resp.text())
                .then(xml => {
                    const parser = new DOMParser()
                    const doc = parser.parseFromString(xml, 'text/xml')
                    const title = doc.getElementsByTagName('title')[0].firstChild.nodeValue

                    sources.push({ 
                        id : "feed-" + Date.now(),
                        url: url,
                        title : name ? name : title
                    })

                    chrome.storage.local.set({ 'sources' : sources }, function() {
                        context.commit('sources', sources)
                    })
                })
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

                    chrome.storage.local.set({ 'entries': list }, function() {
                        context.commit('feed', list)
                    })
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
