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
        },
        feed(state, list) {
            console.log(JSON.stringify(list))
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

createApp(App)
    .use(VuesticPlugin)
    .use(store)
    .mount('#app')
