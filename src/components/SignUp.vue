<template>
  <div class = "container">
    <h1>Welcome to EcoHarbour</h1>
    <h3>Join us in protecting our environment and paving the way for a sustainable future where the well-being of our planet is at the forefront of our actions and decisions.</h3>
  
    <form id="signupform" @submit.prevent="signup">
      <input type="text" id="name" required="" placeholder="Name" v-model="name">
      <input type="text" id="username" required="" placeholder="Username" v-model="username">
      <input type="email" id="email" required="" placeholder="Email" v-model="email">
      <input type="password" id="password" required="" placeholder="Password" v-model="password">
      <input type="password" id="cfmpassword" required="" placeholder="Confirm Password" v-model="cfmpassword">
    </form>

    <button id = "signupbutton" type="button" v-on:click="signup">Sign Up</button>
  </div>
</template>

<script>
import firebaseApp from '../firebaseConfig.js'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth' // firebase authentication
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export default {
data() {
  return {
    name: '',
    username: '',
    email: '',
    password: '',
    cfmpassword: '',
  }
},
methods: {
  async signup() {
    console.log("in signup")

    /* check passwords */
    if (this.password !== this.cfmpassword) {
      alert("Passwords do not match.");
    }


    try {
      /* creating account using email and password */
      const userInfo = await createUserWithEmailAndPassword(auth, this.email, this.password);
      const user = userInfo.user;

      /* send verification email */
      await sendEmailVerification(user);


      /* creating users collection in db to store other user info subsequently*/
      await setDoc(doc(db, "users", user.uid), {
        name: this.name,
        username: this.username,
        email: this.email,
      });

      console.log("Signup successful. Please check your email for verification.");
      this.$router.push({ name: 'verify-email' }).catch(err => {
        console.error(err);
      });
    }
    catch(error) {
      console.error("Error signing up: ", error);
      alert("Error signing up. Please try again.");
    }
  }
}
}
</script>


<style>
</style>