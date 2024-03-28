<script>
  import SignUp from '../components/Signup.vue'

  export default {
    components: {
      SignUp
    }
  }
</script>

<template>
  <div class = "container">
    <h1>Welcome to EcoHarbour</h1>
    <h3>Join us in protecting our environment and paving the way for a sustainable future where the well-being of our planet is at the forefront of our actions and decisions.</h3>
  </div>
  <SignUp />
</template>

<style>
    #container {
        display: block;
        justify-content: center;
        align-items: center;
        width: 60%;
        margin: 0 auto;
    }
    h1, h3 {
      color: #457247;
    }
</style>