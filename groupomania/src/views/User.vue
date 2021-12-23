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
            <p>" {{ user.bio }} "</p>
          </div>
          <!-- <div>
              <a :href="'mailto:' + [[user.]]"
              <font-awesome-icon :icon="['fas', 'envelope']" />
          </div> -->
      </div>
    </div>
  </div>
</template>

<script>
// +-----------------------------------------------------------------------+
// |  TODO possibilité de modifier le profil (bio / image / nom / prénom)  |
// +-----------------------------------------------------------------------+

import { mapState } from "vuex";
import navBar from "@/components/navBar.vue";
const pageId = new URL(location.href).searchParams.get("id")
console.log(pageId)
export default {
  name: "User",
  mounted: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getOneUserInfos", pageId);
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
    }),
  },
  methods: {
    
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
    width : 90vw;
    max-width : 40rem;
    background-color: #161b22;
    border-radius : 2rem;
    padding : 5rem 0;
    &__picture {
      position: absolute;
      transform-origin: center;
      top: 12rem;
      left : 50%;
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
  }
}
</style>
