<script>
</script>


<template>
    <div class = "container">
      <h1>Welcome to EcoHarbour</h1>
      <h3>Join us in protecting our environment and paving the way for a sustainable future where the well-being of our planet is at the forefront of our actions and decisions.</h3>
    
      <form id="signupform">
        <input type="text" id="name1" required="" placeholder="Name">
        <input type="text" id="username1" required="" placeholder="Username">
        <input type="text" id="email1" required="" placeholder="Email">
        <input type="text" id="password1" required="" placeholder="Password">
        <input type="text" id="cfmpassword1" required="" placeholder="Confirm Password">
      </form>

      <button id = "signupbutton" type="button" v-on:click="signup">Sign Up</button>
    </div>
</template>


<style>
</style>