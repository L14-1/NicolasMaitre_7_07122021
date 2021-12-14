<template>
  <div class="home">
    <p class="welcome-message" >Bonjour {{ user.name }} {{ user.lastname }}, <br> que souhaitez-vous partager aujourd'hui ?</p>
    <div class="write-a-post" :class="{'visualize-mode' : opened}" @click="writeAPostSwitch()">
      <font-awesome-icon v-if="mode == 'visualize'" :icon="['fas', 'pencil-alt']" />
      <textarea v-model="content" v-if="mode == 'writeAPost'" type="text" placeholder="Ecrivez votre post ici..." rows="7" required />
      <div class="write-a-post__btns">
        <button v-if="mode == 'writeAPost'">Ajouter une image</button>
        <button v-if="mode == 'writeAPost'" @click.prevent="createPost()">Publier</button>
      </div>
    </div>

    <Posts />
    <Posts />
    <Posts />
    <Posts />
    <Posts />
    <Posts />
    <Posts />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Posts from '@/components/Posts.vue'

export default {
  name: 'Home',
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
      mode: 'visualize',
      content: '',
    }
  },
  computed: {
    ...mapState({
      status: 'status',
      user: 'userInfos',
    }),
    opened: function () {
      if (this.mode == 'visualize') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    writeAPostSwitch: function () {
      if (this.mode == 'visualize') {
        this.mode = 'writeAPost';
      }
    },
    createPost: function () {
      const self = this;
      this.$store.dispatch('createPost', {
        content: this.content,
      }).then(function () {
        self.mode = 'visualize';
      }, function (error) {
        console.log(error);
      })
     }
  }
}
</script>

<style scoped lang="scss">
  .home {
    margin-top : 8rem;
    display : flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .welcome-message {
      margin-bottom : 1rem;
    }
    .visualize-mode {
      &:hover {
        color : greenyellow;
        cursor: pointer;
      }
    }
    .write-a-post {
      padding: 1rem 0;
      border-radius: 1rem;
      background-color: #161b22;
      width: 90vw;
      max-width: 50rem;
      textarea {
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 0.5rem;
        background-color: #555658;
        width: 80%;
        border: none;
        resize : none;
      }
      &__btns {
        display : flex;
        justify-content : space-around;
        button {
          padding : 0 0.5rem;
          height: 2rem;
          border-radius: 0.5rem;
          background-color: #555658;
          border: none;
          cursor:pointer;
          &:hover {
            border : 1px #9e9a9a solid;
          }
          &:last-child:hover {
            border: 1px #00b300 solid;
          }
        }
      }
    }
  }
</style>