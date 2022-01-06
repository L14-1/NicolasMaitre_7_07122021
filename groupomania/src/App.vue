<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">

@import './assets/_variables.scss';

*,
*:before,
*:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  list-style: none;
  font-family: 'Montserrat', sans-serif;
}



// Scrollbar

html {
    &::-webkit-scrollbar {
        width: 0.5rem;
    }
    &::-webkit-scrollbar-thumb {
        background-color: $box-color-accent;
        border-radius: 2rem;
    }
    &::-webkit-scrollbar-track {
        background-color: none;
    }
    // overflow-x: hidden;
}

// Base

body {
  background-color: $background-color;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $text-color;
}

</style>
