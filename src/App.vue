<template>
  <div id="app">
    <Project></Project>
  </div>
</template>

<script>
import Project from "./components/Project";
export default {
  components: {
    Project,
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
</style>
