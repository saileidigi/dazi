import { createStore } from "vuex";
import { queryAll } from "../api";
import {
  getLocalStorageItem,
  setLocalStorageItem
} from "../utils/localStorage";

export default createStore({
  state: {
    sorts: {
      loading: false,
      data: []
    },
    articles: {
      sort: 0,
      loading: false,
      data: []
    },
    article: {
      loading: false,
      data: {}
    }
  },
  mutations: {
    setSorts(state, payload) {
      state.sorts = {
        ...state.sorts,
        ...payload
      };
    },
    setArticles(state, payload) {
      state.articles = {
        ...state.articles,
        ...payload
      };
    },
    setArticle(state, payload) {
      state.article = {
        ...state.article,
        ...payload
      };
    }
  },
  actions: {
    getSorts({ commit }) {
      const data = getLocalStorageItem("sorts") || [];
      commit("setSorts", { loading: true, data });

      return queryAll({
        table: {
          name: "sort",
          no_default_field: true,
          fields: ["id", "label"],
          filters: [[["state", "=", 1]]]
        }
      })
        .then(({ data }) => {
          data = data.map(item => ({ value: item.id, label: item.label }));
          commit("setSorts", { data });
          setLocalStorageItem("sorts", data);
        })
        .finally(() => {
          commit("setSorts", { loading: false });
        });
    },
    getArticles({ commit, state }, sort) {
      if (state.articles.sort === sort || !sort) {
        return Promise.resolve();
      }

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
    getArticle({ commit, state }, id) {
      if (state.article.data.id === id * 1 || !id) {
        return Promise.resolve();
      }

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
          commit("setArticle", { data });
          setLocalStorageItem(lsKey, data);
        })
        .finally(() => {
          commit("setArticle", { loading: false });
        });
    }
  },
  modules: {}
});
