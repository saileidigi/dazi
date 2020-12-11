import { createStore } from "vuex";
import { queryAll } from "../api";
import {
  getLocalStorageItem,
  setLocalStorageItem
} from "../utils/localStorage";

export default createStore({
  state: {
    // 分类列表
    sorts: {
      loading: false,
      data: []
    },
    // 文章列表
    articles: {
      sort: 0,
      loading: false,
      data: []
    },
    // 文章详情
    article: {
      loading: false,
      data: {}
    }
  },
  mutations: {
    // 设置分类分类
    setSorts(state, payload) {
      state.sorts = {
        ...state.sorts,
        ...payload
      };
    },
    // 设置文章列表
    setArticles(state, payload) {
      state.articles = {
        ...state.articles,
        ...payload
      };
    },
    // 设置文章详情
    setArticle(state, payload) {
      state.article = {
        ...state.article,
        ...payload
      };
    }
  },
  actions: {
    // 获取分类列表
    getSorts({ commit }) {
      // 获取缓存数据
      const data = getLocalStorageItem("sorts") || [];
      // 设置 Loading 和 缓存列表
      commit("setSorts", { loading: true, data });

      // 获取
      return queryAll({
        table: {
          // 表字段
          name: "sort",
          // 不要默认字段
          no_default_field: true,
          // 返回字段
          fields: ["id", "label"],
          // 过滤状态
          filters: [[["state", "=", 1]]]
        }
      })
        .then(({ data }) => {
          // 根据选择器，设置分类字段
          data = data.map(item => ({ value: item.id, label: item.label }));
          // 设置数据
          commit("setSorts", { data });
          // 缓存数据
          setLocalStorageItem("sorts", data);
        })
        .finally(() => {
          // 设置 Loading
          commit("setSorts", { loading: false });
        });
    },
    // 获取文章列表
    getArticles({ commit, state }, sort) {
      // 分类相同，不重新获取数据
      if (state.articles.sort === sort || !sort) {
        return Promise.resolve();
      }

      // 文章列表按分类缓存
      const lsKey = "articles-" + sort;
      const data = getLocalStorageItem(lsKey) || [];
      commit("setArticles", { loading: true, data, sort });

      return queryAll({
        table: {
          name: "article",
          no_default_field: true,
          fields: ["id", "title", "author"],
          filters: [
            [
              ["state", "=", 1],
              ["sort", "=", sort]
            ]
          ]
        }
      })
        .then(({ data }) => {
          data = data.map(item => {
            let label = item.title;
            if (item.author.name) {
              label += " - " + item.author.name;
            }
            return { value: item.id, label };
          });
          commit("setArticles", { data, sort });
          setLocalStorageItem(lsKey, data);
        })
        .finally(() => {
          commit("setArticles", { loading: false });
        });
    },
    // 获取文章详情
    getArticle({ commit, state }, id) {
      // id 相同，不重新获取数据
      if (state.article.data.id === id * 1 || !id) {
        return Promise.resolve();
      }

      // key 名跟列表是不同的，少个 s
      const lsKey = "article-" + id;
      const data = getLocalStorageItem(lsKey) || {};
      commit("setArticle", { loading: true, data });

      return queryAll({
        table: {
          name: "article",
          no_default_field: true,
          fields: ["id", "title", "author", "content", "sort"],
          filters: [
            [
              ["state", "=", 1],
              ["id", "=", id]
            ]
          ]
        }
      })
        .then(({ data }) => {
          data = data[0] || {};

          if (data.content) {
            // 内容按换行分段
            data.words = data.content
              .replace(/(\n|\r|↵)/g, "--_,_--")
              .split("--_,_--");
          }

          commit("setArticle", { data });
          setLocalStorageItem(lsKey, data);
        })
        .finally(() => {
          commit("setArticle", { loading: false });
        });
    }
  }
});
