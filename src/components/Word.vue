<template>
  <span class="word">
    <span :style="style">{{ word }}</span>
    <span class="value" :class="{ active }">{{ value }}</span>
  </span>
</template>

<script>
export default {
  props: {
    // 原文字
    word: String,
    // 输入文字
    value: String,
    // 是否在输入
    active: Boolean
  },
  computed: {
    style() {
      const style = {};

      // 错误时样式
      if (this.value !== undefined && this.word !== this.value) {
        style.background = "#f5222d";
      }

      return style;
    }
  }
};
</script>

<style lang="stylus" scoped>
// 模拟光标闪烁动画
@keyframes twinkling {
  0% {
    background #fff
  }
  40% {
    background #333
  }
  80% {
    background #fff
  }
}

.word
  display inline-flex
  flex-direction column
  margin-bottom 20px
  min-width 6px
  vertical-align top
  span
    height 44px
    line-height 44px
    font-size 22px

.value
  border-bottom 1px solid #f0f0f0
  color #333

.active
  &::before
    // 光标
    content ' '
    display inline-block
    margin-top 8px
    width 1px
    height 28px
    animation twinkling 1s infinite
</style>
