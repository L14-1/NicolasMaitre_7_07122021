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
    <div class="profile__recentPost">
      <p>Mes derniers posts :</p>
      <div class="profile__recentPost__onePost">
        <div class="profile__recentPost__onePost--user">
          <div class="profile__recentPost__onePost--user__pic">
            <img alt="pdp" src="../assets/default-profile-pic.jpg" />
          </div>
          <p>Name Lastname</p>
        </div>
        <div class="profile__recentPost__onePost--message">
          <p>lorem ipsum ...</p>
        </div>
        <div class="profile__recentPost__onePost--btns">
          <div class="profile__recentPost__onePost--btns__like">
            <!-- <i class="fas fa-thumbs-up"></i> -->
            <p>like</p>
          </div>
          <div class="profile__recentPost__onePost--btns__dislike">
            <!-- <i class="far fa-thumbs-down"></i> -->
            <p>dislike</p>
          </div>
        </div>
        <div class="profile__recentPost__onePost--comments">
          <div class="profile__recentPost__onePost--comments--user">
            <div class="profile__recentPost__onePost--comments--user__pic">
              <img alt="pdp" src="../assets/default-profile-pic.jpg" />
            </div>
            <p>Name Lastname</p>
          </div>
          <div class="profile__recentPost__onePost--comments--message">
            <p>Great post !</p>
          </div>
        </div>
        <div class="profile__recentPost__onePost--enterYourComment">
          <input placeholder="  comment" required />
          <button>send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.profile {
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  &__recentPost {
    margin-top: 3rem;
    &__onePost {
      margin-top: 2rem;
      padding: 1rem 0;
      border-radius: 1rem;
      background-color: white;
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
        border: 2px #ccffcc solid;
        cursor: pointer;
        &__like {
          width: 50%;
          border-right: 2px #ccffcc solid;
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
        display : flex;
        justify-content : space-around;
        input, button {
          margin-bottom: 0.5rem;
          height: 2rem;
          border-radius: 0.5rem;
          border: 2px #9e9a9a solid;
        }
        button {
          width : 15%;
          border: 2px #00b300 solid;
          cursor: pointer;
        }
        input {
          width : 80%;
        }
      }
    }
  }
}
</style>
