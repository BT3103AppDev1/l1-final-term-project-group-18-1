<template>
    <p class="regularText">You have recycled</p>
    <div class="counter">
      <transition-group name="fade" tag="div" class="counter-container">
        <div v-for="(digit, index) in formattedCount" :key="index" class="counter-digit">
          {{ digit }}
        </div>
      </transition-group>
    </div>
    <p class="regularText">items so far.</p>
  </template>
  
  <script>
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
  import { db } from '@/firebaseConfig';


  export default {
    data() {
      return {
        recycledItems: 0,
        newRecycledItems: 0,
        isChanging: false
      };
    },
    mounted() {
      this.initializeDataWithDelay();
    },
    computed: {
        formattedCount() {
            return this.newRecycledItems.toString().padStart(5, '0').split('');
        },
    },
    methods: {
        initializeDataWithDelay() {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("User is signed in, fetching data.");
                    this.fetchUsername();
                } else {
                    console.error("No user is signed in.");
                }
            });
        },
        async fetchUsername() {
            console.log("fetching username")
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                console.log("user exists")
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    this.username = userSnap.data().username;
                    this.fetchRecycledItems();
                } else {
                    console.error("No such user!");
                }
            } else {
                console.error("No user is signed in.");
            }
        },
      async fetchRecycledItems() {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", this.username));

        try {
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    console.log("No data available for this user.");
                } else {
                    console.log("retreived data working with it now.");
                    querySnapshot.forEach((doc) => {
                        const userData = doc.data();
                        this.newRecycledItems = userData.numRecycled
                        this.animateNumberChange(); // Trigger number change animation
                        setTimeout(() => {
                            this.recycledItems = this.newRecycledItems; // Update recycledItems after animation
                        }, 500) // Wait for animation to complete before updating
                    })
                }
        
        } catch(error) {
            console.error('Error fetching recycled items:', error);
        }                           
      },
      animateNumberChange() {
        this.isChanging = true;
        setTimeout(() => {
            this.recycledItems = this.newRecycledItems;
            this.isChanging = false;
        }, 500); // Transition duration should match the CSS
        }
    }
  };
  </script>
  
  <style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  
  .counter {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .counter-digit {
    background-color: rgba(79,113,75,255);
    color: white;
    font-size: 5em;
    margin: 0 4px;
    padding: 10px;
    border-radius: 20px;
  }

  .counter-container {
    display: flex;
    justify-content: center;
  }

  .regularText{
  font-size: 25px;
  text-align: center;
  color:#457247;
  font-weight:bold
}

  </style>