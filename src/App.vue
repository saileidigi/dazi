<template>
  <a-layout style="min-height:100vh">
    <a-layout>
      <a-layout-header style="background:#fff">
        <a-row type="flex" align="middle">
          <img alt="OOS logo" src="@/assets/logo.svg" style="height:32px;" />
          <router-link :to="{ name: 'Home' }">
            <div style="margin: 0 8px;font-size: 18px;">打字练习</div>
          </router-link>
        </a-row>
      </a-layout-header>

      <a-layout-content>
        <router-view />
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        打字练习 v.{{ APP_VERSION }} ©2020 Created by
        <a href="http://oos.useless-os.xyz" target="_blank"
          >oos.useless-os.xyz</a
        >
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  data() {
    return {
      APP_VERSION: process.env.VUE_APP_VERSION
    };
  }
};
</script>

<style lang="stylus">
#app
  font-family -apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
</style>
