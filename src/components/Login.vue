<template>
    <div id="loginForm" style="text-align: center" >
        <form @submit.prevent="login">
            <input type="email" v-model="email" id="email" placeholder="Email address" required>
            <input v-bind:type="inputType" v-model="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
            <div>
              <input type="checkbox" v-model="showPassword"> Show Password
            </div>
        </form>
    </div>
</template>

<script>
import '@/firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
    };
  },
  computed: {
    inputType() {
      return this.showPassword ? 'text' : 'password';
    }
  },
  methods: {
    login() {
      const auth = getAuth();
      console.log("email: " + this.email);
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // signed in
          const user = userCredential.user;
        //   alert('Login attempted with email ' + this.email);
          this.$router.push({ path: '/Home' });
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  }
}
</script>