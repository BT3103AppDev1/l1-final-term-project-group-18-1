<template>
    <div>
        <h1>Recycling Information</h1>
        <p> checking item: {{ searchQuery }}</p>
        <div v-if="isLoading">Loading...</div>
        <div v-if="error">{{ error }}</div>
        <ul v-if="!isLoading && !error && items.length > 0">
            <li v-for="item in items" :key="item.name">
                <h2>{{ item.name }}</h2>
                <p>Recyclable: {{ item.recyclable ? 'Yes' : 'No' }}</p>
                <p>Information: {{ item.information }}</p>
            </li>
        </ul>
        <p v-if="!isLoading && items.length === 0">No items found.</p>
    </div>
</template>



<script> 
    import { db } from '../../firebaseConfig.js';
    import { collection, where, getDocs, query} from 'firebase/firestore';
  
    export default {
        props: {
            searchQuery: String // declare search query as a prop of type string 
        },
        mounted() {
            this.fetchData();
        },
        watch: {
        searchQuery(newVal, oldVal) {
            // React to search query changes
            if (newVal !== oldVal) {
                this.fetchData();
            }
        }
        },
        data() {
            return {
                items:[],
                isLoading: false,
                error: null
            };
        },
        methods: {
        async fetchData() {
            this.isLoading = true;
            this.items = [];

            try {
            const queryRef = collection(db, 'recyclableItemDetails'); // Reference to the collection
            const q = query(queryRef, where('name', '==', this.searchQuery)); // Create a query against the collection
            const querySnapshot = await getDocs(q); // Execute the query

            if (!querySnapshot.empty) {
                this.items = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } else {
                this.error = "No results found";
            }
            } catch (error) {
                this.error = `Error fetching data: ${error.message}`;
            } finally {
                this.isLoading = false;
            }
        }
        }

    }
    

</script>