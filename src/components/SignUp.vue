<template>
    <div class = "container">
      <h1>Welcome to EcoHarbour</h1>
      <h3>Join us in protecting our environment and paving the way for a sustainable future where the well-being of our planet is at the forefront of our actions and decisions.</h3>
    
      <form id="signupform">
        <input type="text" id="name" required="" placeholder="Name">
        <input type="text" id="username" required="" placeholder="Username">
        <input type="email" id="email" required="" placeholder="Email">
        <input type="password" id="password" required="" placeholder="Password">
        <input type="password" id="cfmpassword" required="" placeholder="Confirm Password">
      </form>

      <button id = "signupbutton" type="button" v-on:click="signup">Sign Up</button>
    </div>
</template>

<script>
import firebaseApp from '../../firebaseConfig.js'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth' // firebase authentication
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      name: '',
      username: '',
      email: '',
      password: '',
      cfmPassword: '',
    }
  },
  methods: {
    async signup() {
      console.log("in signup")

      // check passwords
      if (this.password !== this.cfmPassword) {
        alert("Passwords do not match.");
      }

      try {
        const userInfo = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userInfo.user;
        await setDoc(doc(db, "users", user.uid), {
          name: this.name,
          username: this.username,
          email: this.email,
        });
        alert("Signup successful")

      } catch(error) {
        console.error("Error signing up: ", error);
      }
    }
  }
}
</script>


<style>
</style>../firebaseConfig.js