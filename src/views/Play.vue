<template>
  <a-row type="flex" justify="center">
    <a-card :loading="article.loading" style="margin: 20px 10px; width: 1200px">
      <template v-if="article.data.id" #title>
        {{ article.data.title }}
        <template v-if="article.data.author.name">
          - {{ article.data.author.name }}
        </template>
      </template>
      <template v-if="article.data.id" #extra>
        类型：{{ article.data.sort.label }}
      </template>
      <div>{{ article.data.content }}</div>
      <template v-if="article.data.id" #actions>
        <span>用时：00:50</span>
        <span>速度：120 WPM</span>
        <span>总字数：100</span>
        <span>正确率：99%</span>
        <span>错误：1</span>
      </template>
    </a-card>
  </a-row>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Play",
  computed: {
    ...mapState({
      article: "article"
    })
  },
  created() {
    this.getArticle(this.$route.params.id);
  },
  methods: {
    ...mapActions(["getArticle"])
  }
};
</script>
