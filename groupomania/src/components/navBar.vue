<template>
  <div id="nav" >
    <div class="logo">
      <router-link to="/feed">
        <img alt="Groupomania logo" src="../assets/icon-left-font.png" />
      </router-link>
    </div>
    <div class="links">
      <ul>
        <li>
          <router-link to="/account"
            ><font-awesome-icon :icon="['fas', 'user']"
          /></router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
#nav {
  overflow: hidden;
  font-size: 1rem;
  position: absolute;
  border-bottom: 1px grey solid;
  background-color: #30363d;
  top: 0;
  width: 100vw;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    color: #acb8c8;
    text-decoration: none;
    &:hover {
      color: grey;
    }
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
      margin-right: 3rem;
      padding: 0.2rem;
    }
  }
}
</style>
