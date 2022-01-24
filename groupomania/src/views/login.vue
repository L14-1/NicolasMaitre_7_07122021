<template>
  <div class="login">
    <div class="login_container">
      <img
        alt="Groupomania logo"
        src="../assets/icon-left-font-monochrome-white.svg"
      />
      <form>
        <div>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="  Adresse mail"
            @keyup="emailCheck"
            required
          />
        </div>
        <div
          class="invalid-checked-info"
          v-if="!checkedEmail && email != ''"
        >
          Adresse mail invalide
        </div>
        <div
          class="invalid-checked-info"
          v-if="mode == 'create' && status == 'error_create'"
        >
          Adresse mail déjà utilisée
        </div>
        <div>
          <input
            v-model="name"
            id="name"
            placeholder="  Prénom"
            required
            v-if="mode == 'create'"
            @keyup="nameCheck"
          />
        </div>
        <div
          class="invalid-checked-info"
          v-if="mode == 'create' && !checkedName  && name != ''"
        >
          Prénom invalide.
        </div>
        <input
          v-model="lastname"
          id="lastname"
          placeholder="  Nom"
          required
          v-if="mode == 'create'"
          @keyup="lastnameCheck"
        />
        <div
          class="invalid-checked-info"
          v-if="mode == 'create' && !checkedlastname && lastname != ''"
        >
          Nom invalide.
        </div>
        <div>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="  Mot de passe"
            @keyup="passwordCheck"
            required
          />
        </div>
        <div
          class="invalid-checked-info"
          v-if="!checkedPassword && password != ''"
        >
          Entre 4 et 8 caractères et au moins un chiffre
        </div>
        <div
          class="invalid-login-info"
          v-if="mode == 'login' && status == 'error_login'"
        >
          Adresse mail et/ou mot de passe invalide
        </div>
        

        <button
          v-if="mode == 'login'"
          :class="{ disabled__btn: !validated }"
          @click.prevent="loginAccount()"
        >
          <span v-if="status == 'loading'">Connexion en cours...</span>
          <span v-else>Connexion</span>
        </button>
        <button
          v-if="mode == 'create'"
          :class="{ disabled__btn: !validated }"
          @click.prevent="createAccount()"
        >
          <span v-if="status == 'loading'">Inscription en cours...</span>
          <span v-else>Inscription</span>
        </button>
      </form>
      <p v-if="mode == 'login'" class="switch">
        Pas encore inscrit ?
        <span class="createAccountBtn" @click="createAccountSwitch()"
          >Créer un compte</span
        >
      </p>
      <p v-if="mode == 'create'" class="switch">
        Déjà inscrit ?
        <span class="createAccountBtn" @click="loginAccountSwitch()"
          >Se connecter</span
        >
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "login",
  data: function () {
    return {
      mode: "login",
      email: "",
      name: "",
      lastname: "",
      password: "",
      checkedEmail: true,
      checkedPassword: true,
      checkedName: true,
      checkedlastname: true,
    };
  },
  mounted: function () {
    if (this.$store.state.user.userId != -1) {
      this.$router.push("/account");
      return;
    }
  },
  computed: {
    validated: function () {
      if (this.mode == "create") {
        if (
          this.email != "" &&
          this.name != "" &&
          this.lastname != "" &&
          this.password != ""
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapState(["status"]),
  },
  methods: {
    createAccountSwitch: function () {
      this.mode = "create";
    },
    loginAccountSwitch: function () {
      this.mode = "login";
    },
    emailCheck() {
      this.$store.state.status = '';
      //eslint-disable-next-line
      const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (EMAIL_REGEX.test(this.email)) {
        this.checkedEmail = true;
      } else {
        this.checkedEmail = false;
      }
    },
    passwordCheck() {
      //eslint-disable-next-line
      const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
      if (PASSWORD_REGEX.test(this.password)) {
        this.checkedPassword = true;
      } else {
        this.checkedPassword = false;
      }
    },
    nameCheck() {
      if (this.name.length >= 15 || this.name.length <= 2) {
        this.checkedName = false;
      } else {
        this.checkedName = true;
      }
    },
     lastnameCheck() {
      if (this.lastname.length >= 15 || this.lastname.length <= 2) {
        this.checkedlastname = false;
      } else {
        this.checkedlastname = true;
      }
    },
    loginAccount: function () {
      const self = this;
      this.$store
        .dispatch("loginAccount", {
          email: this.email,
          password: this.password,
        })
        .then(
          function () {
            self.$router.push("/account");
          },
          function (error) {
            console.log(error);
          }
        );
    },
    createAccount: function () {
      const self = this;
      this.$store
        .dispatch("createAccount", {
          email: this.email,
          name: this.name,
          lastname: this.lastname,
          password: this.password,
        })
        .then(
          function () {
            self.loginAccount();
          },
          function (error) {
            console.log(error);
          }
        );
    },
  },
};
</script>

<style lang="scss">

@import '../assets/_variables.scss';

.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_container {
    width: 25rem;
    background-color: $box-color;
    border-radius: 1rem;
    padding: 2rem;
    img {
      width: 10rem;
      margin-bottom: 2rem;
    }
    .invalid-login-info {
      margin: 1rem 0;
    }
    .invalid-checked-info {
      position: relative;
      font-size: 0.8rem;
      margin-bottom: 1rem;
      margin-top: 0.3rem;
      text-align: left;
      &::after {
        content : "";
        position : absolute;
        bottom : -0.25rem;
        left : 0;
        width : 3rem;
        height : 0.15rem;
        background-color: red;
      }
    }
    input,
    button {
      margin-top: 0.5rem;
      width: 95%;
      height: 2rem;
      border-radius: 0.5rem;
      border: none;
      background-color: $box-color-accent;
      color: $text-color;
    }
    button {
      border: 2px $update-color solid;
      cursor: pointer;
    }
    .createAccountBtn {
      color: $like-color;
      text-decoration: underline;
      cursor: pointer;
    }
    .disabled__btn {
      border: 1px $text-color solid;
    }
    .switch {
      margin-top : 1rem;
    }
  }
}
</style>
