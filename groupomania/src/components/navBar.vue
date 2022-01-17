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

@import '../assets/_variables.scss';

#nav {
  z-index: 999;
  overflow: hidden;
  font-size: 1rem;
  position: sticky;
  border-bottom: 1px $text-color solid;
  background-color: $box-color-accent;
  top: 0;
  width: 100vw;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    color: $text-color;
    text-decoration: none;
    &:hover {
      color: grey;
    }
    &.router-link-exact-active {
      color: $update-color;
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
