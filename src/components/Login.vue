<script>
    import firebase from 'firebase';
    import 'firebase/auth';

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
                    await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
                    this.$router.push('/home');
                } catch (error) {
                    this.error = error.message;
                }
            }
        }
    }
</script>