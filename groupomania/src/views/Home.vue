<template>
  <div>
    <navBar />
    <div class="home">
      <p class="welcome-message">
        Bonjour {{ user.name }} {{ user.lastname }}, <br />
        que souhaitez-vous partager aujourd'hui ?
      </p>
      <div
        class="write-a-post"
        :class="{ 'visualize-mode': opened }"
        @click="writeAPostSwitch()"
      >
        <font-awesome-icon
          v-if="mode == 'visualize'"
          :icon="['fas', 'pencil-alt']"
        />
        <textarea
          v-model="content"
          v-if="mode == 'writeAPost'"
          type="text"
          placeholder="Ecrivez votre post ici..."
          rows="7"
          required
        />
        <div class="write-a-post__btns">
          <button v-if="mode == 'writeAPost'">
            <font-awesome-icon :icon="['fas', 'image']" />
          </button>
          <button v-if="mode == 'writeAPost'" @click.prevent="createPost()">
            <font-awesome-icon :icon="['fas', 'paper-plane']" />
          </button>
        </div>
      </div>

      <div
        class="recentPost"
        v-for="allPosts in allPosts.slice().reverse()"
        v-bind:key="allPosts"
      >
        <div class="recentPost__onePost">
          <div class="recentPost__onePost--user">
            <div class="recentPost__onePost--user__pic">
              <img v-if="allPosts.User.imageUrl == null" alt="photo de profil" src="../assets/default-profile-pic.jpg" />
              <img v-if="allPosts.User.imageUrl != null" alt="photo de profil" :src="allPosts.User.imageUrl" />
            </div>
            <p>{{ allPosts.User.name }} {{ allPosts.User.lastname }}</p>
          </div>
          <div class="recentPost__onePost--message">
            <p>{{ allPosts.content }}</p>
          </div>
          <div class="recentPost__onePost--btns">
            <div class="recentPost__onePost--btns__like">
              <font-awesome-icon :icon="['fas', 'thumbs-up']" />
            </div>
            <div class="recentPost__onePost--btns__dislike">
              <font-awesome-icon :icon="['fas', 'thumbs-down']" />
            </div>
          </div>
          <div class="recentPost__onePost--comments">
            <div class="recentPost__onePost--comments--user">
              <div class="recentPost__onePost--comments--user__pic">
                <img alt="pdp" src="../assets/default-profile-pic.jpg" />
              </div>
              <p>Name Lastname</p>
            </div>
            <div class="recentPost__onePost--comments--message">
              <p>Great post !</p>
            </div>
          </div>
          <div class="recentPost__onePost--enterYourComment">
            <input placeholder="  comment" required />
            <button>
              <font-awesome-icon :icon="['fas', 'paper-plane']" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import navBar from "@/components/navBar.vue";

export default {
  name: "Home",
  mounted: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getUserInfos");
    this.$store.dispatch("getAllPosts");
  },
  components: {
    navBar,
  },
  data: function () {
    return {
      mode: "visualize",
      content: "",
    };
  },
  computed: {
    ...mapState({
      status: "status",
      user: "userInfos",
      allPosts: "allPosts",
    }),
    opened: function () {
      if (this.mode == "visualize") {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    writeAPostSwitch: function () {
      if (this.mode == "visualize") {
        this.mode = "writeAPost";
      }
    },
    createPost: function () {
      const self = this;
      this.$store
        .dispatch("createPost", {
          content: this.content,
        })
        .then(
          function () {
            self.mode = "visualize";
            self.$router.go();
          },
          function (error) {
            console.log(error);
          }
        );
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .welcome-message {
    margin-bottom: 1rem;
  }
  .visualize-mode {
    &:hover {
      color: greenyellow;
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
      resize: none;
    }
    &__btns {
      display: flex;
      justify-content: space-around;
      button {
        padding: 0 2rem;
        height: 2rem;
        border-radius: 0.5rem;
        background-color: #555658;
        border: none;
        color: #acb8c8;
        cursor: pointer;
        &:hover {
          border: 1px #9e9a9a solid;
        }
        &:last-child:hover {
          border: 1px #00b300 solid;
        }
      }
    }
  }
}
.recentPost {
  margin-top: 1rem;
  &__onePost {
    margin-top: 2rem;
    padding: 1rem 0;
    // border: 2px #9e9a9a solid;
    border-radius: 1rem;
    background-color: #161b22;
    width: 90vw;
    max-width: 50rem;
    &--user {
      display: flex;
      margin-left: 1rem;
      &__pic {
        width: 3rem;
        height: 3rem;
        overflow: hidden;
        border-radius: 50%;
        border: 3px #ccffcc solid;
        img {
          width: 3rem;
        }
      }
      p {
        padding: 0.75rem 1rem;
      }
    }
    &--message {
      display: flex;
      margin: 1rem;
    }
    &--btns {
      display: flex;
      cursor: pointer;
      &__like {
        width: 50%;
        &:hover {
          color: green;
        }
      }
      &__dislike {
        width: 50%;
        &:hover {
          color: red;
        }
      }
      &::before,
      &::after {
        content: "";
        position: relative;
        top: 0.5rem;
        width: 70vw;
        height: 1px;
        background-color: #9e9a9a;
      }
    }
    &--comments {
      &--user {
        display: flex;
        margin-left: 2rem;
        margin-top: 1rem;
        &__pic {
          width: 1.5rem;
          height: 1.5rem;
          overflow: hidden;
          border-radius: 50%;
          border: 1.5px #ccffcc solid;
          img {
            width: 1.5rem;
          }
        }
        p {
          padding: 0.4rem 1rem;
          font-size: 0.9rem;
        }
      }
      &--message {
        display: flex;
        margin: 0.5rem 5rem;
        font-size: 0.8rem;
      }
    }
    &--enterYourComment {
      display: flex;
      justify-content: space-around;
      input,
      button {
        margin-bottom: 0.5rem;
        height: 2rem;
        border-radius: 0.5rem;
        background-color: #555658;
      }
      button {
        width: 15%;
        border: none;
        color: #acb8c8;
        transition: all 0.5s ease-out;
        &:hover {
          cursor: pointer;
          background-color: #00b300;
          border: 1px #9e9a9a solid;
          transition: all 0.5s ease-out;
        }
      }
      input {
        width: 80%;
        border: none;
      }
    }
  }
}
</style>
