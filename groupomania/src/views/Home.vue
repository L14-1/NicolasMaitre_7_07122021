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
        <img
          v-if="urlImage && mode == 'writeAPost'"
          alt="image de déscription"
          :src="urlImage"
        />
        <div class="write-a-post__btns">
          <input
            type="file"
            id="attachment"
            accept=".jpeg, .png, .jpg"
            @change="loadAttachment"
          />
          <transition name="fade">
          <label for="attachment" v-if="mode == 'writeAPost' && content != ''" class="imageSelector"><font-awesome-icon class="modify-picture" :icon="['fas', 'images']" /></label>
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
              :placeholder="[[postText]]"
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
    <Footer />
  </div>
</template>

<script>
import { mapState } from "vuex";
import navBar from "@/components/navBar.vue";
import Footer from "@/components/footer.vue";

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
    Footer,
  },
  data: function () {
    return {
      mode: "visualize",
      content: "",
      attachment: "",
      urlImage: null,
      userId: JSON.parse(localStorage.getItem("user")).userId,
      comment: "",
      commentNew: "",
      postId: null,
      commentId: null,
      postText: null,
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
      this.urlImage = URL.createObjectURL(this.attachment);
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
          self.urlImage = null;
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
      let postText = event.path[2].firstElementChild.innerText
      if (postText == null) {
        postText = event.path[3].firstElementChild.innerText
      }
      postText = postText.split('\n\n')[1];
      this.content = postText;
      this.postText = postText;

    },
    notModifyPost() {
      this.mode = "visualize";
      (this.content = ""), (this.attachment = ""), (this.postText = "");
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

@import '../assets/_variables.scss';

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
      color: $update-color;
      cursor: pointer;
    }
  }
  .write-a-post {
    padding: 1rem 0;
    border-radius: 1rem;
    background-color: $box-color;
    width: 90vw;
    max-width: 50rem;
    textarea {
      color: $text-color;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 0.5rem;
      background-color: $box-color-accent;
      width: 80%;
      border: none;
      resize: none;
    }
    img {
      object-fit: cover;
      width : 80%;
      border-radius: 0.5rem;
    }
    &__btns {
      display: flex;
      justify-content: space-around;
      button {
        padding: 0 2rem;
        height: 2rem;
        border-radius: 0.5rem;
        background-color: $box-color-accent;
        border: none;
        color: $text-color;
        cursor: pointer;
        &:hover {
          border: 1px $text-color solid;
        }
        &:last-child:hover {
          border: 1px $update-color solid;
        }
      }
      #attachment {
        display : none;
      }
      .imageSelector {
        cursor: pointer;
        &:hover {
          color : $update-color;
        }
        .modify-picture {
          margin-top : 0.5rem;
          font-size: 1.5rem;
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
    background-color: $box-color;
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
        color: $delete-color;
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
        background-color: $box-color-accent;
        color : $text-color;
        width: 80%;
        height: 5rem;
        border: none;
        resize: none;
      }
      &__attachment {
        border-radius: 0.5rem;
        background-color: $box-color-accent;
        margin-bottom: 2rem;
      }
      &__button {
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px $text-color solid;
        background-color: transparent;
        color: $text-color;
        cursor: pointer;
        &:hover {
          background-color: $box-color-accent;
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
    border-radius: 1rem;
    background-color: $box-color;
    width: 90vw;
    max-width: 50rem;
    .deletePostCross {
      position: absolute;
      top: 1rem;
      right: 1rem;
      &:hover {
        color: $delete-color;
        cursor: pointer;
      }
    }
    .editPostPencil {
      position: absolute;
      top: 1rem;
      right: 2.5rem;
      &:hover {
        color: $update-color;
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
        border: 2px $profil-border-color solid;
        img {
          width: 3rem;
          height: 3rem;
          object-fit: cover;
        }
      }
      a {
        padding: 0.75rem 1rem;
        color: $text-color;
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
        color: $like-color;
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
          color: $like-color;
        }
      }
      &::before,
      &::after {
        content: "";
        position: relative;
        top: 0.5rem;
        width: 70vw;
        height: 1px;
        background-color: $text-color;
      }
    }
    &--comments {
      position: relative;
      background-color: $box-color-accent;
      margin: 1rem 1rem;
      padding: 0.5rem 0.5rem;
      border-radius: 1rem;
      .deleteCommentCross {
        position: absolute;
        top: 0.5rem;
        right: 0.75rem;
        font-size: 0.75rem;
        &:hover {
          color: $delete-color;
          cursor: pointer;
        }
      }
      .editCommentPencil {
        position: absolute;
        top: 0.5rem;
        right: 2rem;
        font-size: 0.75rem;
        &:hover {
          color: $update-color;
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
          border: 1px $profil-border-color solid;
          img {
            width: 1.5rem;
            height: 1.5rem;
            object-fit: cover;
          }
        }
        a {
          padding: 0.3rem 1rem;
          font-size: 0.9rem;
          color: $text-color;
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
          color: $text-color;
          background-color: $box-color-accent;
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
        background-color: $box-color-accent;
      }
      button {
        width: 15%;
        border: none;
        color: $text-color;
        transition: all 0.5s ease-out;
        &:hover {
          cursor: pointer;
          background-color: $update-color;
          border: 1px $text-color solid;
          transition: all 0.5s ease-out;
        }
      }
      input {
        color: $text-color;
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
