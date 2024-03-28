<template>
    <div>
      <img src="../assets/email_verification.png">
      <h1>One final step! We need to verify your email.</h1>
      <h3>Please check your inbox for verification link sent to your email.</h3>
      <h5>Can't find it? Please check your spam folder.</h5>
    </div>
</template>

<script>
export default {
 props: ['email'], /* to be modified */
}
</script>

<style>
  img {
    width: 10%;
    height: auto; /* keeps the image aspect ratio */
  }
</style>