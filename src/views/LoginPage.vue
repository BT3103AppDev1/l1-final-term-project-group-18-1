<template>
    <div>
        <div>
            nav banner
        </div>
        <div style="text-align: center;">
            <h1 style="color:#457247;">Welcome Back to EcoHarbour</h1>
            Thank you for your efforts in protecting our environment and paving the way for a sustainable
            future where the well-being of our planet is at the forefront of our actions and decisions.
        </div>
        <div>
            <form @submit.prevent="login">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required v-model="email">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required v-model="password">
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
</template>

<script>
    import firebaseApp from '../firebaseConfig.js'
    import { getFirestore } from 'firebase/firestore'
    import { getAuth, signInWithEmailAndPassword } from 'firebase/auth' // firebase authentication
    const auth = getAuth(firebaseApp);

    export default {
        name: 'Login',
        data() {
            return {
                email: '',
                password: '',
                error: null
            }
        },
        methods: {
            async login() {
                try {
                    console.log('successful')
                    await signInWithEmailAndPassword(auth, this.email, this.password);
                    this.$router.push('/Home');
                } catch (error) {
                    this.error = error.message;
                }
            }
        }
    }
</script>