<template>
  <div class="login">
    <div class="login_container">
      <img
        alt="Groupomania logo"
        src="../assets/icon-left-font-monochrome-black.svg"
      />
      <form>
        <div>
          <input v-model="email" id="email" type="email" placeholder="  Adresse mail" required />
        </div>
        <div>
          <input v-model="name" id="name" placeholder="  Prénom" required v-if="mode == 'create'" />
        </div>
            <input v-model="lastName" id="lastname" placeholder="  Nom" required v-if="mode == 'create'"/>
        <div>
          <input v-model="password" id="password" type="password" placeholder="  Mot de passe" required />
        </div>
        <button v-if="mode == 'login'" :class="{'disabled__btn' : !validated}" @click="loginAccount()">Connexion</button>
        <button v-if="mode == 'create'"  :class="{'disabled__btn' : !validated}" @click.prevent="createAccount()">Inscription</button>
      </form>
      <p v-if="mode == 'login'">Pas encore inscrit ? <span class="createAccountBtn" @click="createAccountSwitch()">Créer un compte</span></p>
      <p v-if="mode == 'create'">Déjà inscrit ? <span class="createAccountBtn" @click="loginAccountSwitch()">Se connecter</span></p>
    </div>
  </div>
</template>

<script>
export default {
    name: 'login',
    data: function () {
        return {
            mode: 'login',
            email: '',
            name: '',
            lastName: '',
            password: '',
        }
    },
    computed: {
        validated: function () {
            if (this.mode == 'create') {
                if (this.email != "" && this.name != "" && this.lastName != "" && this.password != "") {
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
        }
    },
    methods: {
        createAccountSwitch: function () {
            this.mode = 'create';
        },
        loginAccountSwitch: function () {
            this.mode = 'login';
        },
        createAccount: function () {
            
            this.$store.dispatch('createAccount', {
                email: this.email,
                name: this.name,
                lastName: this.lastName,
                password: this.password,
            })
        }
    }
}
</script>

<style lang="scss">

.login {
  background-color: #ccffcc;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_container {
      width : 25rem;
    background-color: white;
    border-radius: 1rem;
    padding: 2rem;
    img {
      width: 10rem;
      margin-bottom: 2rem;
    }
    input, button {
      margin-bottom: 0.5rem;
      width : 95%;
      height: 2rem;
      border-radius: 0.5rem;
      border: 2px #9e9a9a solid;
    }
    button {
        border: 2px #00b300 solid;
        cursor: pointer;
    }
    .createAccountBtn {
        color : blue;
        text-decoration: underline;
        cursor: pointer;
    }
    .disabled__btn {
        border: 2px #9e9a9a solid;
    }
  }
}
</style>
