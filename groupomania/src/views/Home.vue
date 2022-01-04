<template>
  <div>
    <navBar />
    <div
      class="home"
      :class="{ homeBlur: mode == 'modifyPost' || status == 'loading' }"
    >
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
          v-if="mode != 'writeAPost'"
          :icon="['fas', 'pencil-alt']"
        />
        <transition name="fade">
        <textarea
          v-model="content"
          v-if="mode == 'writeAPost'"
          type="text"
          placeholder="Ecrivez votre post ici..."
          rows="7"
          required
        />
        </transition>
        <div class="write-a-post__btns">
          <transition name="fade">
          <input
            type="file"
            id="attachment"
            accept=".jpeg, .png, .jpg"
            @change="loadAttachment"
            v-if="mode == 'writeAPost'"
          />
          </transition>
          <transition name="fade">
          <button
            v-if="mode == 'writeAPost' && content != ''"
            @click.prevent="createPost()"
          >
            <font-awesome-icon :icon="['fas', 'paper-plane']" />
          </button>
          </transition>
        </div>
      </div>

      <div
        class="recentPost"
        v-for="allPosts in allPosts"
        v-bind:key="allPosts.id"
      >
        <div class="recentPost__onePost" :id="allPosts.id">
          <font-awesome-icon
            class="deletePostCross"
            :icon="['fas', 'times']"
            @click="deletePost"
            v-if="allPosts.UserId == user.id || user.isAdmin"
          />
          <font-awesome-icon
            class="editPostPencil"
            :icon="['fas', 'edit']"
            @click="updatePost"
            v-if="allPosts.UserId == user.id"
          />
          <div class="recentPost__onePost--user">
            <div class="recentPost__onePost--user__pic">
              <img
                v-if="allPosts.User.imageUrl == null"
                alt="photo de profil"
                src="../assets/default-profile-pic.jpg"
              />
              <img
                v-if="allPosts.User.imageUrl != null"
                alt="photo de profil"
                :src="allPosts.User.imageUrl"
              />
            </div>
            <a
              v-if="allPosts.UserId != user.id"
              :href="'user?id=' + [[allPosts.UserId]]"
            >
              <font-awesome-icon
                :icon="['fas', 'user-shield']"
                v-if="allPosts.User.isAdmin"
              />
              {{ allPosts.User.name }} {{ allPosts.User.lastname }}
            </a>
            <a v-else href="account">
              <font-awesome-icon
                :icon="['fas', 'user-shield']"
                v-if="allPosts.User.isAdmin"
              />
              {{ allPosts.User.name }} {{ allPosts.User.lastname }}
            </a>
          </div>
          <div class="recentPost__onePost--message">
            <p>{{ allPosts.content }}</p>
            <img
              v-if="allPosts.attachment != null"
              alt="image de description du post"
              :src="allPosts.attachment"
            />
          </div>
          <div class="recentPost__onePost--btns">
            <div class="recentPost__onePost--btns__like">
              <font-awesome-icon
                :icon="['fas', 'heart']"
                class="pointer_icon"
                :class="{
                  likeActive: allPosts.Likes.some(
                    (like) => like['userId'] === userId
                  ),
                }"
                @click.prevent="likePost"
              />
              <p v-if="allPosts.Likes.length == 0">
                Soyez le premier à aimer !
              </p>
              <p v-else-if="allPosts.Likes.length == 1">1 personne aime ca</p>
              <p v-else>{{ allPosts.Likes.length }} personnes aiment ca</p>
            </div>
          </div>
          <div
            class="recentPost__onePost--comments"
            v-for="allPostsComments in allPosts.Comments"
            v-bind:key="allPostsComments.id"
          >
            <div
              class="recentPost__onePost--comments--user"
              :id="'comment_' + allPostsComments.id"
            >
              <font-awesome-icon
                class="deleteCommentCross"
                :icon="['fas', 'times']"
                v-if="allPostsComments.userId == user.id || user.isAdmin"
                @click="deleteComment"
              />
              <font-awesome-icon
                class="editCommentPencil"
                :icon="['fas', 'edit']"
                @click="updateComment"
                v-if="allPostsComments.userId == user.id"
              />
              <div class="recentPost__onePost--comments--user__pic">
                <img alt="pdp" :src="allPostsComments.imageUrl" />
              </div>
              <a
                v-if="allPostsComments.userId != user.id"
                :href="'user?id=' + [[allPostsComments.userId]]"
              >
                {{ allPostsComments.name }} {{ allPostsComments.lastname }}
              </a>
              <a v-else href="account"
                >{{ allPostsComments.name }} {{ allPostsComments.lastname }}</a
              >
            </div>
            <div class="recentPost__onePost--comments--message">
              <input
                v-model="commentNew"
                :placeholder="allPostsComments.comment"
                v-if="
                  mode == 'updateComment' && allPostsComments.id == commentId
                "
                class="commentInput"
              />
              <p v-else>{{ allPostsComments.comment }}</p>
            </div>
          </div>
          <form class="recentPost__onePost--enterYourComment">
            <input v-model="comment" placeholder="commenter" required />
            <button @click.prevent="commentPost" v-if="comment != ''">
              <font-awesome-icon :icon="['fas', 'paper-plane']" />
            </button>
          </form>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="modifyPost" v-if="mode == 'modifyPost'">
        <div class="modifyPost__container">
          <font-awesome-icon
            class="modifyPost__container__cross"
            :icon="['fas', 'times']"
            @click="notModifyPost"
          />
          <form class="modifyPost__container__form">
            <textarea
              class="modifyPost__container__form__content"
              placeholder="Votre nouveau message ..."
              v-model="content"
              type="text"
            />
            <input
              class="modifyPost__container__form__attachment"
              type="file"
              accept=".jpeg, .png, .jpg"
              @change="loadAttachment"
            />
            <button
              class="modifyPost__container__form__button"
              @click.prevent="modifyPost"
            >
              Modifier
            </button>
          </form>
        </div>
      </div>
    </transition>
    <div class="loading_spinner" v-if="status == 'loading'">
      <div class="lds-ripple">
        <div></div>
        <div></div>
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
      attachment: "",
      userId: JSON.parse(localStorage.getItem("user")).userId,
      comment: "",
      commentNew: "",
      postId: null,
      commentId: null,
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
    loadAttachment(event) {
      this.attachment = event.target.files[0];
    },
    createPost: function () {
      const self = this;
      const formData = new FormData();
      formData.append("content", this.content);
      formData.append("attachment", this.attachment);
      this.$store.dispatch("createPost", formData).then(
        function () {
          self.mode = "visualize";
          self.$store.dispatch("getAllPosts");
          self.content = "";
          self.attachment = "";
        },
        function (error) {
          console.log(error);
        }
      );
    },
    likePost(event) {
      const self = this;
      let postId = event.path[4].getAttribute("id");
      if (postId == null) {
        postId = event.path[3].getAttribute("id");
      }

      this.$store.dispatch("likePost", postId).then(function () {
        self.$store.dispatch("getAllPosts");
      });
    },
    commentPost(event) {
      const self = this;
      let postId = event.path[2].getAttribute("id");
      if (postId == null) {
        if (postId == null) {
          postId = event.path[3].getAttribute("id");
        }
        postId = event.path[4].getAttribute("id");
      }

      this.$store
        .dispatch("commentPost", {
          postId: postId,
          comment: this.comment,
        })
        .then(function () {
          self.$store.dispatch("getAllPosts");
          self.comment = "";
        });
    },
    deleteComment(event) {
      const self = this;
      if (this.mode == "updateComment") {
        this.mode = "visualize";
        this.comment = "";
        this.commentId = null;
      } else {
        if (confirm("Etes vous sûr de vouloir supprimer ce commentaire ?")) {
          let commentId = event.path[2].getAttribute("id");
          if (commentId == null) {
            commentId = event.path[1].getAttribute("id");
          }

          commentId = commentId.split("_")[1];

          this.$store.dispatch("deleteComment", commentId).then(function () {
            self.$store.dispatch("getAllPosts");
          });
        }
      }
    },
    deletePost(event) {
      if (confirm("Etes vous sûr de vouloir supprimer ce post ?")) {
        const self = this;
        let postId = event.path[2].getAttribute("id");
        if (postId == null) {
          postId = event.path[1].getAttribute("id");
        }
        this.$store.dispatch("deletePost", postId).then(function () {
          self.$store.dispatch("getAllPosts");
        });
      }
    },
    updatePost(event) {
      this.mode = "modifyPost";
      let postId = event.path[2].getAttribute("id");
      if (postId == null) {
        postId = event.path[1].getAttribute("id");
      }
      this.postId = postId;
    },
    notModifyPost() {
      this.mode = "visualize";
      (this.content = ""), (this.attachment = "");
    },
    modifyPost() {
      const self = this;
      const formData = new FormData();
      formData.append("content", this.content);
      formData.append("attachment", this.attachment);
      formData.append("postId", this.postId);
      this.$store.dispatch("updatePost", formData).then(
        function () {
          self.mode = "visualize";
          self.$store.dispatch("getAllPosts");
          self.content = "";
          self.attachment = "";
        },
        function (error) {
          console.log(error);
        }
      );
    },
    updateComment(event) {
      let commentId = event.path[2].getAttribute("id");
      if (commentId == null) {
        commentId = event.path[1].getAttribute("id");
      }
      commentId = commentId.split("_")[1];

      if (this.mode == "updateComment") {
        this.$store.dispatch("updateComment", {
          id: commentId,
          comment: this.commentNew,
        });
        this.mode = "visualize";
        this.commentNew = "";
        this.$store.dispatch("getAllPosts");
      } else {
        this.mode = "updateComment";
        this.commentId = commentId;
      }
      this.$store.dispatch("getAllPosts");
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
      background-color: #3a3b3c;
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
        background-color: #3a3b3c;
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
.homeBlur {
  filter: blur(10px);
}
.loading_spinner {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .lds-ripple {
    display: inline-block;
    position: relative;

    width: 80px;
    height: 80px;
    div {
      position: absolute;
      border: 4px solid #fff;
      opacity: 1;
      border-radius: 50%;
      animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
      &:nth-child(2) {
        animation-delay: -0.5s;
      }
    }
  }
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
.modifyPost {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  &__container {
    position: relative;
    background-color: #161b22;
    padding: 2rem 0;
    border-radius: 1rem;
    width: 90vw;
    max-width: 30rem;
    &__cross {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      cursor: pointer;
      &:hover {
        color: red;
      }
    }
    &__form {
      display: flex;
      flex-direction: column;
      align-items: center;
      &__content {
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 0.5rem;
        background-color: #3a3b3c;
        width: 80%;
        border: none;
        resize: none;
      }
      &__attachment {
        border-radius: 0.5rem;
        background-color: #3a3b3c;
        margin-bottom: 2rem;
      }
      &__button {
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px #acb8c8 solid;
        background-color: transparent;
        color: #acb8c8;
        cursor: pointer;
        &:hover {
          background-color: #3a3b3c;
        }
      }
    }
  }
}
.recentPost {
  margin-top: 1rem;
  &__onePost {
    position: relative;
    margin-top: 2rem;
    padding: 1rem 0;
    // border: 2px #9e9a9a solid;
    border-radius: 1rem;
    background-color: #161b22;
    width: 90vw;
    max-width: 50rem;
    .deletePostCross {
      position: absolute;
      top: 1rem;
      right: 1rem;
      &:hover {
        color: red;
        cursor: pointer;
      }
    }
    .editPostPencil {
      position: absolute;
      top: 1rem;
      right: 2.5rem;
      &:hover {
        color: green;
        cursor: pointer;
      }
    }
    &--user {
      display: flex;
      margin-left: 1rem;
      &__pic {
        width: 3rem;
        height: 3rem;
        overflow: hidden;
        border-radius: 50%;
        border: 2px white solid;
        img {
          width: 3rem;
          height: 3rem;
          object-fit: cover;
        }
      }
      a {
        padding: 0.75rem 1rem;
        color: #acb8c8;
        text-decoration: none;
        &:hover {
          font-weight: 700;
        }
      }
    }
    &--message {
      display: flex;
      flex-direction: column;
      margin: 1rem;
      p {
        margin-left: 5%;
        margin-bottom: 2rem;
        width: 90%;
        text-align: left;
      }
    }
    &--btns {
      display: flex;

      .pointer_icon {
        cursor: pointer;
      }
      .likeActive {
        color: rgb(255, 0, 200);
      }
      &__like {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        p {
          font-size: 70%;
          margin-left: 0.5rem;
        }
        &:hover {
          color: rgb(255, 0, 200);
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
      position: relative;
      background-color: #3a3b3c;
      margin: 1rem 1rem;
      padding: 0.5rem 0.5rem;
      border-radius: 1rem;
      .deleteCommentCross {
        position: absolute;
        top: 0.5rem;
        right: 0.75rem;
        font-size: 0.75rem;
        &:hover {
          color: red;
          cursor: pointer;
        }
      }
      .editCommentPencil {
        position: absolute;
        top: 0.5rem;
        right: 2rem;
        font-size: 0.75rem;
        &:hover {
          color: green;
          cursor: pointer;
        }
      }
      &--user {
        display: flex;

        &__pic {
          width: 1.5rem;
          height: 1.5rem;
          overflow: hidden;
          border-radius: 50%;
          border: 1px white solid;
          img {
            width: 1.5rem;
            height: 1.5rem;
            object-fit: cover;
          }
        }
        a {
          padding: 0.3rem 1rem;
          font-size: 0.9rem;
          color: #acb8c8;
          text-decoration: none;
          &:hover {
            font-weight: 700;
          }
        }
      }
      &--message {
        display: flex;
        margin: 0.5rem 1rem;
        font-size: 0.8rem;
        .commentInput {
          background-color: #3a3b3c;
          border: none;
          &:focus {
            outline: none;
          }
        }
      }
    }
    &--enterYourComment {
      display: flex;
      justify-content: space-around;
      margin-top: 2rem;
      input,
      button {
        margin-bottom: 0.5rem;
        height: 2rem;
        border-radius: 0.5rem;
        background-color: #3a3b3c;
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
        padding: 0 0.5rem;
        width: 80%;
        border: none;
      }
    }
  }
}

// animations
.fade-enter-active {
  transition: opacity 1s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
