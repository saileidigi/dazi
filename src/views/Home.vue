<template>
  <a-row type="flex" justify="center">
    <a-card style="margin-top: 20px" title="选择文章">
      <div style="margin-bottom: 20px">
        <label>类型：</label>
        <a-select
          v-model:value="formData.sort"
          :options="sorts.data"
          :loading="sorts.loading"
          placeholder="请选择类型"
          style="width: 270px"
          @change="fetchArticles"
        />
      </div>
      <div style="margin-bottom: 20px">
        <label>文章：</label>
        <a-select
          v-model:value="formData.id"
          :options="articles.data"
          :loading="articles.loading"
          placeholder="请选择文章"
          style="width: 270px"
        />
      </div>
      <a-button type="primary" block @click="play">开始</a-button>
    </a-card>
  </a-row>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      formData: {
        sort: undefined,
        id: undefined
      }
    };
  },
  computed: {
    ...mapState({
      sorts: "sorts",
      articles: "articles",
      article: "article"
    })
  },
  created() {
    this.fetchSorts();
  },
  methods: {
    ...mapActions(["getSorts", "getArticles"]),
    async fetchSorts() {
      try {
        !this.sorts.data.length && (await this.getSorts());
      } catch (err) {
        // no todo
      }

      if (this.sorts.data.length) {
        this.formData.sort = this.articles.sort || this.sorts.data[0].value;
        this.fetchArticles();
      }
    },
    async fetchArticles() {
      try {
        await this.getArticles(this.formData.sort);
      } catch (err) {
        // no todo
      }

      if (this.articles.data.length) {
        if (
          this.article.data.id &&
          this.article.data.sort.id === this.formData.sort
        ) {
          this.formData.id = this.article.data.id;
        } else {
          this.formData.id = this.articles.data[0].value;
        }
      }
    },
    play() {
      if (!this.formData.id) {
        this.$message.error("没有选择文章");
      } else {
        this.$router.push({ name: "Play", params: { id: this.formData.id } });
      }
    }
  }
};
</script>
