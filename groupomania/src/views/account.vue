<template>
  <div>
    <navBar />
    <div class="profile">
      <font-awesome-icon
        v-if="mode == 'account'"
        class="modify-icon"
        :icon="['fas', 'pencil-alt']"
        @click="modifyProfil()"
      />
      <font-awesome-icon
        v-if="mode == 'modifyProfil'"
        class="modify-icon"
        :icon="['fas', 'times']"
        @click="backToAccount()"
      />
      <div class="profile--form">
        <form enctype="multipart/form-data">
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

          <input
            type="file"
            id="imageUrl"
            accept=".jpeg, .png, .jpg"
            @change="loadPicture"
            v-if="mode == 'modifyProfil'"
          />
          <font-awesome-icon
              :icon="['fas', 'user-shield']"
              v-if="user.isAdmin && mode != 'modifyProfil'" 
          />

          <div class="profile--form__title">
            <p v-if="mode == 'account'">{{ user.name }}</p>
            <p v-if="mode == 'account'">{{ user.lastname }}</p>
            <input
              v-model="name"
              id="name"
              :placeholder="[[user.name]]"
              v-if="mode == 'modifyProfil'"
            />
            <input
              v-model="lastname"
              id="lastname"
              :placeholder="[[user.lastname]]"
              v-if="mode == 'modifyProfil'"
            />
          </div>
          <div
            class="profile--form__description"
            v-if="user.bio != null || mode == 'modifyProfil'"
          >
            <p v-if="mode == 'account'">" {{ user.bio }} "</p>
            <textarea
              v-model="bio"
              v-if="mode == 'modifyProfil'"
              type="text"
              :placeholder="[[user.bio]]"
              rows="3"
            />
          </div>
          <button
            v-if="mode == 'modifyProfil'"
            @click.prevent="changeProfil()"
            class="button--update"
          >
            MODIFIER
          </button>
        </form>
      </div>
      <button
        v-if="mode == 'account'"
        @click="logout()"
        class="button--disconnect"
      >
        DECONNEXION
      </button>
      <button
        v-if="mode == 'modifyProfil'"
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
// import axios from 'axios';

export default {
  name: "Account",
  mounted: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getUserInfos");
  },
  components: {
    navBar,
  },
  data: function () {
    return {
      mode: "account",
      name: "",
      lastname: "",
      bio: "",
      imageUrl: null,
    };
  },
  computed: {
    ...mapState({
      user: "userInfos",
    }),
  },
  methods: {
    logout: function () {
      this.$store.commit("logout");
      this.$router.push("/");
    },
    modifyProfil: function () {
      this.mode = "modifyProfil";
    },
    backToAccount: function () {
      this.mode = "account";
    },
    loadPicture(event) {
      this.imageUrl = event.target.files[0];
    },
    changeProfil: function () {
      const self = this;
      const formData = new FormData();
      formData.append("imageUrl", this.imageUrl);
      formData.append("bio", this.bio);
      formData.append("name", this.name);
      formData.append("lastname", this.lastname);

      this.$store.dispatch("changeProfil", formData).then(
        function () {
          self.mode = "account";
          self.$store.dispatch("getUserInfos");
        },
        function (error) {
          console.log(error);
        }
      );
    },
    deleteAccount() {
      if (confirm("Supprimer votre compte est action définitive, vous ne pouvez revenir en arrière ... Etes vous sûr ?")) {
        const self = this;
        let userId = this.user.id
        this.$store.dispatch("deleteAccount", userId)
        .then(function () {
          self.$store.commit("logout");
          self.$router.push("/");
        });
      }
    },
  },
};
</script>

<style lang="scss">

@import '../assets/_variables.scss';

.profile {
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .modify-icon {
    position: absolute;
    top: 5rem;
    right: 2rem;
    &:hover {
      cursor: pointer;
      color: $update-color;
    }
  }

  &--form {
    margin-top: 10rem;
    width : 90vw;
    max-width : 40rem;
    background-color: $box-color;
    border-radius : 2rem;
    padding : 5rem 0;
    &__picture {
      position: absolute;
      transform-origin: center;
      top: 12rem;
      left : 50%;
      transform: translateX(-50%);
      border: 4px white solid;
      box-shadow: 0 0 0 10px $background-color;
      width: 10rem;
      height: 10rem;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 10rem;
        height: 10rem;
        object-fit: cover;
      }
      &--btn {
        bottom: -0.6rem;
        border: none;
        color: text-color;
        cursor: pointer;
        &:hover {
          color: $delete-color;
        }
        .pencilPicture {
          position: relative;
          top: -9rem;
          font-size: 6rem;
        }
      }
    }
    &__title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      p,
      input {
        margin: 2rem 1rem;
      }
      input {
        width: 5rem;
        padding: 0.25rem;
      }
    }
    &__description {
      textarea {
        padding: 0.25rem;
        background-color: $box-color-accent;
        width: 15rem;
        border-radius: 0.5rem;
        border: none;
        resize: none;
      }
    }
  }
  input {
    background-color: $box-color-accent;
    border-radius: 0.5rem;
    color: $text-color;
    border: none;
  }
  .button--disconnect {
    margin-top: 3rem;
    padding: 0 1rem;
    height: 2rem;
    border: 1px red solid;
    border-radius: 0.5rem;
    color: $text-color;
    background-color: transparent;
    transition: all 0.5s ease-out;
    &:hover {
      border: none;
      cursor: pointer;
      background-color: $delete-color;
      transition: all 0.5s ease-out;
    }
  }
  .button--update {
    margin-top: 3rem;
    padding: 0 1rem;
    height: 2rem;
    border: 1px $update-color solid;
    border-radius: 0.5rem;
    color: $text-color;
    background-color: transparent;
    transition: all 0.5s ease-out;
    &:hover {
      border: none;
      cursor: pointer;
      background-color: $update-color;
      transition: all 0.5s ease-out;
    }
  }
}
</style>
