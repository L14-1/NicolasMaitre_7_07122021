<template>
  <div>
    <navBar />
    <div class="profile">
      <div class="profile--form">
        <div class="profile--form__picture">
          <img
            v-if="user.imageUrl == null"
            alt="photo de profil"
            src="../assets/default-profile-pic.jpg"
          />
          <img
            v-if="user.imageUrl != null"
            alt="photo de profil"
            :src="user.imageUrl"
          />
        </div>

        <div class="profile--form__title">
          <p>{{ user.name }}</p>
          <p>{{ user.lastname }}</p>
        </div>
        <div class="profile--form__description">
          <p v-if="user.bio">" {{ user.bio }} "</p>
        </div>
        <div class="profile--form__mail">
          <a :href="'mailto:' + user.email">
            <font-awesome-icon :icon="['fas', 'envelope']" />
          </a>
        </div>
      </div>
      <button
        v-if="!!(userLooking.isAdmin)"
        @click="deleteAccount"
        class="button--disconnect"
      >
        SUPPRIMER LE COMPTE
      </button>
    </div>
  </div>
</template>

<script>

import { mapState } from "vuex";
import navBar from "@/components/navBar.vue";
const pageId = new URL(location.href).searchParams.get("id");

export default {
  name: "User",
  mounted: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getOneUserInfos", pageId);
    this.$store.dispatch("getUserInfos");
    
  },
  components: {
    navBar,
  },
  data: function () {
    return {
      mode: "",
      name: "",
      lastname: "",
      bio: "",
      imageUrl: null,
    };
  },
  computed: {
    ...mapState({
      user: "oneUserInfos",
      userLooking: "userInfos"
    }),
  },
  methods: {
    deleteAccount() {
      if (confirm("Etes vous sûr de vouloir supprimer cet utilisateur ?")) {
        const self = this;
        this.$store.dispatch("deleteAccount", pageId)
        .then(function () {
          self.$router.push("/feed");
        });
      }
    }
  },
};
</script>

<style lang="scss">
.profile {
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &--form {
    margin-top: 10rem;
    width: 90vw;
    max-width: 40rem;
    background-color: #161b22;
    border-radius: 2rem;
    padding: 5rem 0;
    &__picture {
      position: absolute;
      transform-origin: center;
      top: 12rem;
      left: 50%;
      transform: translateX(-50%);
      border: 4px white solid;
      box-shadow: 0 0 0 10px #0d1117;
      width: 10rem;
      height: 10rem;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 10rem;
        height: 10rem;
        object-fit: cover;
      }
    }
    &__title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      p {
        margin: 2rem 1rem;
      }
    }
    &__mail {
      margin-top : 2rem;
      a {
        color : #acb8c8;
        font-size: 2rem;
        &:hover {
          color : #5f8ecc;
        }
      }
    }
  }
  .button--disconnect {
    margin-top: 3rem;
    padding: 0 1rem;
    height: 2rem;
    border: 1px red solid;
    border-radius: 0.5rem;
    color: #acb8c8;
    background-color: transparent;
    transition: all 0.5s ease-out;
    &:hover {
      border: none;
      cursor: pointer;
      background-color: red;
      transition: all 0.5s ease-out;
    }
  }
}
</style>
