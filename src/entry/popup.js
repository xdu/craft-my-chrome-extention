import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import { VuesticPlugin } from 'vuestic-ui'

import App from '../view/app.vue'
import Feed from '../view/feed.vue'
import Entry from '../view/entry.vue'
//import Feeds from '../view/feeds.vue'
import Edit from '../view/edit.vue'

const store = createStore({
    //
    // Store has two lists, one to store feeds, one to store all the articles
    //
    state() {
        return {
            url: '',
            entries: [],
            sources: []
        }
    },
    mutations: {

        articles(state, list) {
            if (list) {
                state.entries = [...list]
            }
        },
        sources(state, list) {
            if (list) {
                state.sources = [...list]
            }
        }
    },
    actions: {
        //
        // Load all the feed sources to store
        //
        init(context) {
            chrome.storage.local.get(['sources', 'articles'], (result) => {
                context.commit('sources', result.sources)
                context.commit('articles', result.articles)
            })
        },

        updateSources(context, payload) {
            context.commit('sources', payload.sources)
        },

        //
        // Save a feed source with its articles in payload to local storage 
        // 
        updateFeed(context, payload) {

            chrome.storage.local.get(['sources'], (result) => {

                if (!result.sources) {
                    // The source list is empty
                    //
                    let sources = [{
                        url: payload.url, title: payload.title, lastUpdate: Date.now()
                    }]
                    chrome.storage.local.set({ 'sources': sources }, function () {
                        context.commit('sources', sources)
                    })
                } else {
                    // The source list is not empty
                    //
                    let sources = [...result.sources]
                    let found = sources.find(e => e.url === payload.url)

                    if (!found) {
                        // The source list doesn't contain current feed
                        //
                        sources.push({
                            url: payload.url, title: payload.title, lastUpdate: Date.now()
                        })
                    } else {
                        // The source list contains current feed, do an update
                        found.lastUpdate = Date.now()
                    }
                    chrome.storage.local.set({ 'sources': sources }, function () {
                        context.commit('sources', sources)
                    })
                }
                //
                // Merge the articles
                //
                console.log(payload.entries.length + " new articles fetched.")

                chrome.storage.local.get('articles', function (result) {

                    if (!result.articles) {
                        result.articles = payload.entries
                    } else {
                        for (let i = 0; i < payload.entries.length; i++) {
                            const curr = payload.entries[i].id

                            if (!result.articles.find(e => e.id === curr)) {
                                result.articles.push(payload.entries[i])
                            }
                        }
                    }

                    result.articles.sort(function (a, b) {
                        return (b.date - a.date)
                    })

                    chrome.storage.local.set({ 'articles': result.articles }, function () {
                        context.commit('articles', result.articles)
                    })

                })
            })
        },

        //
        // Save all the articles to vuex store
        //
        updateArticles(context, articles) {
            context.commit('articles', articles)
        }
    }
})

const routes = [
    { path: '/', name: 'feed', component: Feed },
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
