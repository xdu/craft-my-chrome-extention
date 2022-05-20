import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter, createWebHashHistory} from 'vue-router'
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
    actions:{
        //
        // Load all the feed sources to store
        //
        init(context) {
            chrome.storage.local.get(['sources'], (result) => {
                context.commit('sources', result.sources)
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
                
                if (! result.sources) {
                    //
                    // The storage has no feed yet
                    //
                    let sources = [{ 
                        url: payload.url, title: payload.title
                    }]
                    chrome.storage.local.set({ 'sources' : sources }, function() {
                        context.commit('sources', sources)
                    })
                } else if (! result.sources.find(e => e.url === payload.url)) {
                    //
                    // The storage is not empty and doesn't contain current feed
                    //
                    let sources = [... result.sources]
                    sources.push({ 
                        url: payload.url, title: payload.title 
                    })
                    chrome.storage.local.set({ 'sources' : sources }, function() {
                        context.commit('sources', sources)
                    })
                }
                //
                // Merge the articles
                //
                console.log(payload.entries.length + " new articles fetched.")
                
                chrome.storage.local.get('articles', function(result) {

                    for(let i = 0; i < payload.entries.length; i ++) {
                        const curr = payload.entries[i].id

                        if (! result.articles.find( e => e.id === curr)) {
                            result.articles.push( payload.entries[i] )
                        }
                    }

                    result.articles.sort(function(a, b) {
                        return (b.date - a.date)
                    })

                    chrome.storage.local.set({ 'articles' : result.articles }, function() {
                        context.commit('articles', result.articles)
                    })

                })
            })
        },

        //
        // Load all the articles from the local storage to vuex store.
        // 
        fetchFeed(context) {
            chrome.storage.local.get('articles', function(result) {
                context.commit('articles', result.articles)
            })
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
