<template>
  <div class = "container">
    <h1 style="color:#457247;">Welcome to EcoHarbour</h1>
    <p style="color:#457247;">Join us in protecting our environment and paving the way for a sustainable future where the well-being of our planet is at the forefront of our actions and decisions.</p>

    <form id="signupform" @submit.prevent="signup">
      <input type="text" id="name" required="" placeholder="Name" v-model="name">
      <input type="text" id="username" required="" placeholder="Username" v-model="username">
      <input type="email" id="email" required="" placeholder="Email" v-model="email">
      <input v-bind:type="inputType" id="password" required="" placeholder="Password" v-model="password">
      <input v-bind:type="inputType" id="cfmpassword" required="" placeholder="Confirm Password" v-model="cfmpassword">
    </form>
    <div>
      <input type="checkbox" v-model="showPassword"> Show Password
    </div>
    <button id = "signupbutton" type="button" v-on:click="signup">Sign Up</button>
  </div>

  <!-- Banner Image Section -->
  <div class="banner-section">
    <img src="@/assets/Banner.png" alt="EcoHarbour Banner" class="banner-image" />
  </div>
</template>

<script>
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import firebaseApp from '../firebaseConfig.js';

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
      checkEmailVerificationInterval: null,
      showPassword: false,
    };
  },
  computed: {
    inputType() {
      return this.showPassword ? 'text' : 'password';
    }
  },
  methods: {
    async isUsernameUnique(username) {
      try {
        const usernameRef = doc(db, "uniqueUsernames", username);
        const docSnap = await getDoc(usernameRef);
        return !docSnap.exists();
      } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return false;
      }
    },

    async signup() {
      if (this.password !== this.cfmpassword) {
        alert("Passwords do not match.");
        return;
      }

      if (this.password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }

      if (this.username.length > 10) {
        alert("Username must be 10 characters or less.");
        return;
      }

      const unique = await this.isUsernameUnique(this.username);
      if (!unique) {
        alert("This username is already taken. Please choose another one.");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        await sendEmailVerification(user);

        await setDoc(doc(db, "users", user.uid), {
          name: this.name,
          username: this.username,
          email: this.email,
          fertiliser: 0
        });

        await setDoc(doc(db, "uniqueUsernames", this.username), {
          userId: user.uid
        });

        alert("Signup successful. Please check your email for verification.");
        if (!user.emailVerified) {
          // Sign out the user
          await auth.signOut();
          // Redirect to a page that reminds them to verify their email
          this.$router.push({ name: 'verify-email' });
        } else {
          // wait for email to be verified redirect to the home or dashboard page
          this.$router.push({ name: 'Home' });
        }
      } catch (error) {
        console.error("Error signing up:", error);
        alert("Error signing up. Please try again.");
      }
    },
  }
}
</script>

<style scoped>
.container {
  position: relative;
  z-index: 2;
  display: block;
  justify-content: center;
  align-items: center;
  width: 70%;
  margin: 0 auto;
  margin-top: 10vh;
}

button {
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #457247;
  background-color: #457247;
  color: white;
  cursor: pointer;
  transition: background-color 0.1s;
}

button:active {
  background-color: #3b5e3b;
}

#show {
  display: flex;
  justify-content: flex-end;
  margin: 5px;
}

.banner-section {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
  width: 100%;
}

.banner-image {
  width: 100%;
  height: auto;
  display: block;
}
</style>