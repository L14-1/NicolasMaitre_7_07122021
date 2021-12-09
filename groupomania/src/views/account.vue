<template>
  <div class="profile">
    <div class="profile__picture">
      <img alt="photo de profil" src="../assets/default-profile-pic.jpg" />
    </div>
    <div class="profile__title">
      <p>Name</p>
      <p>LastName</p>
    </div>
    <div class="profile__description">
      <p>" my bio "</p>
    </div>
    <p class="myLastPost">Mes derniers posts :</p>
    <Posts />

  </div>
</template>

<script>
// @ is an alias to /src
import Posts from '@/components/Posts.vue'

export default {
  name: 'Account',
  components: {
    Posts
  }
}
</script>


<style lang="scss">
.profile {
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .myLastPost {
    margin-top : 5rem;
    transform: translateX(-10rem);
    text-decoration: underline;
  }
  &__picture {
    border: 4px white solid;
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 10rem;
    }
  }
  &__title {
    display: flex;
    flex-direction: row;
    p {
      margin: 2rem 1rem;
    }
  }
  
}
</style>
