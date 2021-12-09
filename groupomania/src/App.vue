<template>
  <div id="app">
    <div id="nav">
      <div class="logo">
        <router-link to="/feed">
          <img
            alt="Groupomania logo"
            src="../src/assets/icon-left-font.png"
          />
        </router-link>
      </div>
      <div class="links">
        <ul>
          <li>
            <router-link to="/account">Profil</router-link>
          </li>
        </ul>
      </div>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
*,
*:before,
*:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  list-style: none;
  font-family: "Readex Pro", sans-serif;
}

body {
  background-color: #0d1117;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #acb8c8;
}

#nav {
  overflow: hidden;
  font-size: 1rem;
  position: absolute;
  box-shadow: 0 3px 10px red;
  background-color: #30363d;
  top: 0;
  width: 100vw;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    color: #161b22;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
  .logo {
    padding: 0 1rem;
    img {
      position: relative;
      left: -1rem;
      top: 0.25rem;
      width: 15rem;
    }
  }
  .links ul {
    display: flex;
    li {
      margin-right: 1rem;
      padding: 0.2rem;
    }
  }
}
</style>
