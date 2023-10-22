<template>
  <a-row type="flex" justify="center">
    <a-card :loading="article.loading" style="margin: 20px 10px; width: 1200px">
      <!-- 标题 -->
      <template v-if="article.data.id" #title>
        {{ article.data.title }}
        <template v-if="article.data.author">
          - {{ article.data.author }}
        </template>
      </template>

      <!-- 类型 -->
      <template v-if="article.data.id" #extra>
        类型：{{ article.data.sort.label }}
      </template>

      <!-- 打字内容 -->
      <div class="content" @click="focus">
        <!-- 输入框 -->
        <textarea
          v-show="!isDone"
          ref="textarea"
          v-model="value"
          :style="textareaStyle"
          @keydown.prevent.enter.up.down.left.right.ctrl
          @blur="pause"
          @focus="restore"
        />

        <!-- 文字内容 -->
        <div v-for="(row, key) in article.data.words" :key="key">
          <!-- 中文首页缩进 -->
          <span v-if="article.data.sort.id === 1" class="tab" />
          <!-- 文字 -->
          <Word
            v-for="(word, index) in row"
            :ref="
              `word${
                inputWords.length - 1 === key &&
                index === inputWords[key].length
                  ? 'Active'
                  : ''
              }`
            "
            :key="index"
            :word="word"
            :value="inputWords[key] ? inputWords[key][index] : undefined"
            :active="
              inputWords.length - 1 === key && index === inputWords[key].length
            "
          />
        </div>
      </div>

      <!-- 练习结果 -->
      <template v-if="article.data.id" #actions>
        <span>用时：{{ time }}</span>
        <span>速度：{{ wpm }} WPM</span>
        <span>总字数：{{ value.length }}</span>
        <span>正确率：{{ correctRate }}%</span>
        <span>错误：{{ errorNum }}</span>
      </template>
    </a-card>

    <!-- 练习结束弹窗 -->
    <a-modal
      v-model:visible="doneModalVisible"
      :maskClosable="false"
      :width="300"
      title="打字练习结束"
      okText="重新开始"
      cancelText="取消"
      @ok="reset"
    >
      <p style="border-bottom: 1px solid #f0f0f0">
        <a-row type="flex" justify="space-between">
          <span>用时：</span>
          <span>{{ time }}</span>
        </a-row>
      </p>
      <p style="border-bottom: 1px solid #f0f0f0">
        <a-row type="flex" justify="space-between">
          <span>速度：</span>
          <span>{{ wpm }} WPM</span>
        </a-row>
      </p>
      <p style="border-bottom: 1px solid #f0f0f0">
        <a-row type="flex" justify="space-between">
          <span>总字数：</span>
          <span>{{ value.length }}</span>
        </a-row>
      </p>
      <p style="border-bottom: 1px solid #f0f0f0">
        <a-row type="flex" justify="space-between">
          <span>正确率：</span>
          <span>{{ correctRate }}%</span>
        </a-row>
      </p>
      <a-row
        type="flex"
        justify="space-between"
        style="border-bottom: 1px solid #f0f0f0"
      >
        <span>错误：</span>
        <span>{{ errorNum }}</span>
      </a-row>
    </a-modal>
  </a-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Word from "../components/Word";

export default {
  name: "Play",
  components: { Word },
  data() {
    return {
      // 输入字符
      value: "",
      // 输入字符分段
      inputWords: [""],
      // 用时秒
      second: 0,
      // 输入框样式，主要用在定位
      textareaStyle: {},
      // 是否已完成
      isDone: false,
      // 是否显示结束弹窗
      doneModalVisible: false
    };
  },
  computed: {
    ...mapState({
      article: "article"
    }),
    // 错误数量
    errorNum() {
      // 去掉换行再对比
      const value = this.value.replace(/(\n|\r|↵)/g, "");
      const content = this.article.data.content.replace(/(\n|\r|↵)/g, "");
      let num = 0;
      for (let i in value) {
        if (value[i] !== content[i]) {
          ++num;
        }
      }
      return num;
    },
    // 正确率
    correctRate() {
      return this.value.length
        ? (
            ((this.value.length - this.errorNum) / this.value.length) *
            100
          ).toFixed(2)
        : 0;
    },
    // 格式化时间
    time() {
      return (
        (Math.floor(this.second / 60) + "").padStart(2, "0") +
        ":" +
        ((this.second % 60) + "").padStart(2, "0")
      );
    },
    // 字/分钟
    wpm() {
      return this.second && Math.floor(this.value.length / (this.second / 60));
    }
  },
  watch: {
    value(val, oldVal) {
      // 超过内容长度
      if (val.length > this.article.data.content.length) {
        this.value = val.slice(0, this.article.data.content.length);
        return;
      }

      // 分段
      this.inputWords = val.replace(/(\n|\r|↵)/g, "--_,_--").split("--_,_--");
      const index = this.inputWords.length - 1;
      const over =
        this.inputWords[index].length - this.article.data.words[index].length;

      if (
        this.inputWords.length < this.article.data.words.length &&
        over === 0
      ) {
        // 段刚好结束，增加新段
        this.inputWords.push("");
      } else if (over > 0) {
        // 段超长，插入换行
        const index = val.length - over;
        this.value = val.slice(0, index) + "↵" + val.slice(index);
      } else {
        if (!val) {
          // 无内容，算重新开始
          this.second = 0;
          this.pause();
        } else if (!oldVal) {
          // 旧内容为空，开始
          this.second = 0;
          this.start();
        } else if (val.length === this.article.data.content.length) {
          // 完成
          // 暂停计时
          this.pause();
          // 标记结束
          this.isDone = true;
          // 弹出结束弹窗
          this.doneModalVisible = true;
        }
      }

      this.$nextTick(() => {
        // 定位输入框
        this.handleTextareaStyle();
      });
    }
  },
  created() {
    // 获取文章详情
    this.getArticle(this.$route.params.id);
  },
  beforeUnmount() {
    // 销毁前，暂停计时
    this.pause();
  },
  methods: {
    ...mapActions(["getArticle"]),
    // 开始计时
    start() {
      if (this.isDone) return;

      const callback = () => {
        ++this.second;
        clearTimeout(this.start.timeout);
        this.start.timeout = setTimeout(callback, 1000);
      };

      clearTimeout(this.start.timeout);
      this.start.timeout = setTimeout(callback, 1000);
    },
    // 暂停计时
    pause() {
      clearTimeout(this.start.timeout);
    },
    // 恢复计时
    restore() {
      this.handleTextareaStyle();
      this.second && this.start();
    },
    // 获取焦点
    focus() {
      if (this.isDone) {
        this.doneModalVisible = true;
        return;
      }

      this.handleTextareaStyle();

      this.$nextTick(() => {
        this.$refs.textarea.focus();
      });
    },
    // 输入框定位
    handleTextareaStyle() {
      if (!this.$refs.wordActive) return;

      const { oldOffsetTop, firstScrollY } = this.handleTextareaStyle;
      const { offsetTop, offsetLeft } = this.$refs.wordActive.$el;

      this.textareaStyle = {
        top: offsetTop + 44 + "px",
        left: offsetLeft + "px"
      };

      if (firstScrollY === undefined) {
        this.handleTextareaStyle.firstScrollY = scrollY;
      }

      if (oldOffsetTop !== offsetTop) {
        this.handleTextareaStyle.oldOffsetTop = offsetTop;

        setTimeout(() => {
          // 滚动窗口
          scrollTo({ top: firstScrollY + offsetTop, behavior: "smooth" });
        }, 100);
      }
    },
    // 重新开始
    reset() {
      this.isDone = false;
      this.doneModalVisible = false;
      this.value = "";
      scrollTo({
        top: this.handleTextareaStyle.firstScrollY,
        behavior: "smooth"
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.content
  position relative
  user-select none
  textarea
    position absolute
    z-index 1
    width 0
    height 44px
    line-height 44px
    opacity 0
.tab
  display inline-block
  margin-bottom 20px
  width 44px
  height 88px
  vertical-align top
</style>
