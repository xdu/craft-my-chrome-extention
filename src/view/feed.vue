<template>
  <va-list>
    <va-list-label>
      <div class="row justify--space-between">
        <div class="flex xs3">
          <div class="item"></div>
        </div>
        <div class="flex xs6 align-self--center">
          <div class="item">Articles</div>
        </div>
        <div class="flex xs3">
          <div class="item">
            <router-link :to="{ name: 'edit' }">
              <va-icon name="settings" color="primary" size="small" />
            </router-link>
          </div>
        </div>
      </div>
    </va-list-label>
    <va-list-item v-for="e in articles" :key="e.id">
      <router-link
        :to="{
          name: 'entry',
          params: { id: e.id, feed: this.$route.params.id },
        }"
      >
        <va-list-item-section>
          <va-list-item-label :lines="2" :style="{ 'font-weight': e.read ? 400 : 600}">{{ e.title }}</va-list-item-label>
          <va-list-item-label caption>{{
            dayjs(e.date).fromNow()
          }}</va-list-item-label>
        </va-list-item-section>
      </router-link>
    </va-list-item>
  </va-list>
</template>

<script>
import { mapState } from "vuex";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

export default {
  name: "articles",

  created() {
    dayjs.extend(relativeTime);
    this.dayjs = dayjs;
  },

  computed: {
    ...mapState({
      articles: (state) => state.entries,
    }),
  },
};
</script>
