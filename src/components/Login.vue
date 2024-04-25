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
          const user = userCredential.user;
          if (user.emailVerified) {
          // User's email is verified, proceed to Home page
          this.$router.push({ path: '/Home' });
        } else {
          // User's email is not verified, redirect to a verify-email page or show a message
          this.$router.push({ name: 'verify-email' }); // Make sure to have a route named 'verify-email'
          alert('Please verify your email to log in.');
        }
        })
        .catch((error) => {
          alert(this.handleAuthError(error.code));
          console.log("error" + error.message)
        });
    },
    handleAuthError(errorCode) {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already in use by another account.';
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled.';
      case 'auth/weak-password':
        return 'The password is too weak.';
      case 'auth/user-disabled':
        return 'This user has been disabled.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.';
      case 'auth/network-request-failed':
        return 'A network error has occurred. Check your internet connection and try again.';
      case 'auth/operation-not-allowed':
        return 'Sign-in with email and password is not enabled.';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check that you have entered every field correctly.'
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  }
}
</script>