<template>
    <div>
      <div v-if="recycledData" class="recycled-data">
        <div v-for="(value, index) in recycledData.labels" :key="index" class="recycled-item">
          <div class="label">{{ value }}:</div>
          <div class="value">{{ recycledData.values[index] }}</div>
        </div>
      </div>
    </div>
</template>

<script>
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export default {
    data() {
        return {
            recycledData: null,
            username: '',
        };
    },
    mounted() {
        this.fetchUsername();
    },
    methods: {
        async fetchUsername() {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    this.username = userSnap.data().username;
                    this.fetchRecycledData();
                } else {
                    console.error("No such user!");
                }
            } else {
                console.error("No user is signed in.");
            }
        },
        async fetchRecycledData() {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", this.username));

            try {
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    console.log("No data available for this user.");
                } else {
                    querySnapshot.forEach((doc) => {
                        const userData = doc.data();
                        this.recycledData = {
                            labels: ['Metal', 'Plastic', 'Paper', 'E-Waste', 'Glass'],
                            values: [
                                userData.metalRecycled || 0,
                                userData.plasticRecycled || 0,
                                userData.paperRecycled || 0,
                                userData.ewasteRecycled || 0,
                                userData.glassRecycled || 0
                            ]
                        };
                        console.log('Fetched data:', this.recycledData);
                    });
                }
            } catch (error) {
                console.error("Error fetching recycled data:", error);
            }
        }
    },
    watch: {
        username(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.fetchRecycledData();
            }
        }
    },
}
</script>
