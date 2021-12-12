<template>
  <div class="recentPost">
    <div class="recentPost__onePost">
      <div class="recentPost__onePost--user">
        <div class="recentPost__onePost--user__pic">
          <img alt="pdp" src="../assets/default-profile-pic.jpg" />
        </div>
        <p>Name Lastname</p>
      </div>
      <div class="recentPost__onePost--message">
        <p>lorem ipsum ...</p>
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
        <button>send</button>
      </div>
    </div>
  </div>
</template>


<script>
// export default {
//   name: 'HelloWorld',
//   props: {
//     msg: String
//   }
// }
//
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
      &::before, &::after {
        content: '';
        position: relative;
        top: 0.5rem;
        width : 70vw;
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
        border: 1px #00b300 solid;
        transition: all 0.5s ease-out;
        &:hover {
          cursor : pointer;
          background-color: #00b300;
          border: 1px #9e9a9a solid;
          transition: all 0.5s ease-out;
        }
      }
      input {
        width: 80%;
        border: 1px #9e9a9a solid;
      }
    }
  }
}
</style>
