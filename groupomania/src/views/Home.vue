<template>
  <div class="home">
    <img alt="Groupomania logo" src="../assets/icon-left-font-monochrome-black.svg">
    <HelloWorld msg="Bienvenue sur le réseau social Groupomania"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>

<style lang="scss">
.home {
  margin-top : 8rem;
}
</style>