<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
html {
  width: 100%;
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
  min-width: 1360px;
  min-height: 600px;
  user-select: none;
}
.app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
