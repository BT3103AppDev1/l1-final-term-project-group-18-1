<template>
    <div>
      <h1>One final step! We need to verify your email.</h1>
      <h3>Please check your inbox for verification link sent to {{email}}</h3>
      <h5>Can't find it? Please check your spam folder.</h5>
    </div>
</template>

<script>
export default {
 props: ['email'],
}
</script>