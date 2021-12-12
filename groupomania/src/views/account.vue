<template>
  <div class="profile">
    <div class="profile__picture">
      <img alt="photo de profil" src="../assets/default-profile-pic.jpg" />
    </div>
    <div class="profile__title">
      <p>{{ user.name }}</p>
      <p>{{ user.lastname }}</p>
    </div>
    <div class="profile__description" v-if="user.bio != null" >
      <p>" {{ user.bio }} "</p>
    </div>
    <p class="myLastPost">Mes derniers posts :</p>
    <Posts />
    <button @click="logout()" class="button--disconnect">
      Déconnexion
    </button>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex'
import Posts from '@/components/Posts.vue'

export default {
  name: 'Account',
  mounted: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push('/');
      return;
    }
    this.$store.dispatch('getUserInfos');
  },
  components: {
    Posts
  },
  computed: {
    ...mapState({
      user: 'userInfos',
    })
  },
  methods: {
    logout: function() {
      this.$store.commit('logout');
      this.$router.push('/');
    }
  }
}
</script>


<style lang="scss">
.profile {
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .myLastPost {
    margin-top : 5rem;
    transform: translateX(-10rem);
    text-decoration: underline;
  }
  &__picture {
    border: 4px white solid;
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 10rem;
    }
  }
  &__title {
    display: flex;
    flex-direction: row;
    p {
      margin: 2rem 1rem;
    }
  }
  .button--disconnect {
    margin-top : 3rem;
    padding : 0 1rem;
    height: 2rem;
    border: 1px #9e9a9a solid;
    border-radius: 0.5rem;
    background-color: red;
    transition: all 0.5s ease-out;
    &:hover {
      cursor : pointer;
      background-color: rgb(255, 66, 66);
      transition: all 0.5s ease-out;
    }
  }
}
</style>
