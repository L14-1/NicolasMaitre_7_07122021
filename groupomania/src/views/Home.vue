<template>
  <div class="home">
    <div class="write-a-post">
      <textarea type="text" placeholder="  Ecrivez votre post ici..." rows="7" required />
      <div class="write-a-post__btns">
        <button>Ajouter une image</button>
        <button>Publier</button>
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
// @ is an alias to /src
import Posts from '@/components/Posts.vue'

export default {
  name: 'Home',
  components: {
    Posts
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
    .write-a-post {
      padding: 1rem 0;
      border-radius: 1rem;
      background-color: #161b22;
      width: 90vw;
      max-width: 50rem;
      textarea {
        margin-bottom: 0.5rem;
        border-radius: 0.5rem;
        background-color: #555658;
        width: 80%;
        border: 1px #9e9a9a solid;
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
          border: 1px #9e9a9a solid;
          &:last-child {
            border: 1px #00b300 solid;
          }
        }
      }
    }
  }
</style>