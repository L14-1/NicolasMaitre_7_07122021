<template>
  <div class="profile">
    <font-awesome-icon v-if="mode == 'account'" class="modify-icon" :icon="['fas', 'pencil-alt']" @click="modifyProfil()" />
    <font-awesome-icon v-if="mode == 'modifyProfil'" class="modify-icon" :icon="['fas', 'times']" @click="backToAccount()" />
    <div class="profile__picture">
      <img alt="photo de profil" src="../assets/default-profile-pic.jpg" />
      <button v-if="mode == 'modifyProfil'" >
        <font-awesome-icon :icon="['fas', 'pencil-alt']"  />
      </button>
    </div>

    <form class="profile--form">
      <div class="profile--form__title">
        <p v-if="mode == 'account'">{{ user.name }}</p>
        <p v-if="mode == 'account'">{{ user.lastname }}</p>
        <input v-model="name" id="name" :placeholder="[[ user.name ]]" v-if="mode == 'modifyProfil'" />
        <input v-model="lastname" id="lastname" :placeholder="[[ user.lastname ]]" v-if="mode == 'modifyProfil'" />
      </div>
      <div class="profile--form__description" v-if="user.bio != null || mode == 'modifyProfil'" >
        <p v-if="mode == 'account'" >" {{ user.bio }} "</p>
        <textarea v-model="bio" v-if="mode == 'modifyProfil'" type="text" :placeholder="[[ user.bio ]]" rows="3" required />
      </div>
      <button v-if="mode == 'modifyProfil'" @click.prevent="changeProfil()" class="button--disconnect">
      MODIFIER
      </button>
    </form>

    <p v-if="mode == 'account'" class="myLastPost">Mes derniers posts :</p>
    <Posts v-if="mode == 'account'" />
    <button v-if="mode == 'account'" @click="logout()" class="button--disconnect">
      DECONNEXION
    </button>
  </div>
</template>

<script>
// @ is an alias to /src

// +-----------------------------------------------------------------------+
// |  TODO possibilité de modifier le profil (bio / image / nom / prénom)  |
// +-----------------------------------------------------------------------+


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
  data: function () {
    return {
      mode: 'account',
      name: '',
      lastname: '',
      bio: ''
    }
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
    },
    modifyProfil: function() {
      this.mode = 'modifyProfil'
    },
    backToAccount: function() {
      this.mode = 'account'
    },
    changeProfil: function () {
      const self = this;
      this.$store.dispatch('changeProfil', {
        bio: this.bio,
      }).then(function () {
        self.mode = 'account';
        self.$router.go();
      }, function (error) {
        console.log(error);
      })
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
  .modify-icon {
    position: absolute;
    top : 5rem;
    right : 2rem;
    &:hover {
      cursor: pointer;
      color : red;
    }
  }
  &__picture {
    position : absolute;
    top : 7rem;
    border: 4px white solid;
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 10rem;
    }
    button {
      position : relative;
      bottom : 2.5rem;
      width : 8rem;
      height : 2rem;
      background-color: #555658;
      border : none;
      color : #acb8c8;
      cursor: pointer;
      &:hover {
        background-color: grey;
      }
    }
  }
  &--form {
    margin-top : 10rem;
    &__title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      p, input {
        margin: 2rem 1rem;
      }
      input {
        width : 5rem;
        padding : 0.25rem;
      }
    }
    &__description {
      textarea {
        padding: 0.25rem;
        background-color: #555658;
        width: 15rem;
        border-radius : 0.5rem;
        border: none;
        resize : none;
      }
    }
  }
  input {
    background-color: grey;
    border-radius: 0.5rem;
    background-color: #555658;
    color : #acb8c8;
    border : none;
  }
  .myLastPost {
    margin-top : 5rem;
    transform: translateX(-10rem);
    // text-decoration: underline;
  }
  .button--disconnect {
    margin-top : 3rem;
    padding : 0 1rem;
    height: 2rem;
    border: none;
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
