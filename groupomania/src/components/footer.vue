<template>
  <footer id="footer" >
    <div>
        © 2021 - {{currentDate()}} Groupomania.
    </div>
  </footer>
</template>

<script>
export default {
  methods: {
    currentDate() {
      const current = new Date();
      const date = `${current.getFullYear()}`;
      return date;
    }
  }
};
</script>


<style scoped lang="scss">

@import '../assets/_variables.scss';

#footer {
    margin-top : 2rem;
    padding: 1rem 0;
    background-color: $box-color;
}

</style>