<template>
    <div class = "container">
        <div class = "pageHeader">Thank you for making the Earth a better place!</div>
        <div class = "subheader">Key in your item here</div>
        <SearchBarWoBtn />
        <div v-if="isLoading">Loading...</div>
        <div v-if="error">{{ error }}</div>
        <div v-if="!isLoading && !error && item">
            <div class = "information">
                <p style="font-size: 35px; font-weight:bold">{{ capitalizeWords(item.name) }}</p>

                <!-- <p class = "labels">Recyclable:</p> <p class ="text">{{ item.recyclable ? 'Yes' : 'No' }}</p> -->
                <div class = "inline-texts" :class="{ 'recyclable': item.recyclable, 'non-recyclable': !item.recyclable }">
                    <p class ="text">{{ item.recyclable ? 'Yes' : 'No' }}</p> 
                    <p class = "text">it</p> 
                    <p class ="text">{{ item.recyclable ? 'can' : 'can\'t' }}</p> 
                    <p class = "text">recycled</p>
                </div>

                <p class = "labels">Information: </p>
                <ul class = "information-list">
                <li v-for="(sentence, index) in informationSentences" :key="index">
                    {{ sentence.trim() }}
                 </li>
            </ul>
            <!-- <p>Information: {{ item.information }}</p> -->
            </div>
        </div>
        <p v-if="!isLoading && !item">No items found.</p>
    </div>
</template>



<script> 
    import { db } from '../../firebaseConfig.js';
    import { collection, where, getDocs, query} from 'firebase/firestore';
    import SearchBarWoBtn from '@/components/SearchBarWoBtn.vue';
  
    export default {
        props: {
            searchQuery: String // declare search query as a prop of type string 
        },
        components: {
            SearchBarWoBtn
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
                item:null,
                isLoading: false,
                error: null
            };
        },
        computed: {
            informationSentences() {
            // Check if item and item.information exist
            if (this.item && this.item.information) {
                // Split the information string into sentences
                 // Do not split on periods that are followed by a space and a lowercase letter.
                 return this.item.information.split(/(?<!\b\w)\. (?=[A-Z])/g);
            }
            return [];
            }
        },
        methods: {
            async fetchData() {
                this.isLoading = true;
                this.item = null;

                try {
                const queryRef = collection(db, 'recyclableItemDetails'); // Reference to the collection
                const q = query(queryRef, where('name', '==', this.searchQuery)); // Create a query against the collection
                const querySnapshot = await getDocs(q); // Execute the query

                if (!querySnapshot.empty) {
                    this.item = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data()};
                } else {
                    this.error = "No results found";
                    this.item = null; //set to null if no results found
                }
                } catch (error) {
                    this.error = `Error fetching data: ${error.message}`;
                    this.item = null; //set to null if error
                } finally {
                    this.isLoading = false;
                }
            },
            capitalizeWords(str) { //method to capitalise the first letter of each word for names
                return str.replace(/\b\w/g, char => char.toUpperCase());
            }
        },
    }
</script>

<style>
    .container {
        width:100%;
        display: flex;
        flex-direction: column; /* Stack children vertically */
        align-items: center;    /* Center children horizontally */
        justify-content: center; /* Center children vertically if needed */
        height: 100vh; /* Full viewport height, adjust as needed */
        text-align: center; /* Ensures text inside the container is also centered */
    }

    .pageHeader{
        color: #4f714b;  
        font-size: 65px; 
        font-weight: bold; 
        max-width:2000px;
        margin: 0 auto; /*centers the header*/
    }
    .subheader{
        color: #4f714b;
        font-size: 40px;   
    }

    .labels{
        color: #4f714b;
        font-size: 35px;   
    }

    .inline-texts .text {
        display: inline;
        margin-right: 5px;
        font-weight: bold;
        font-size: 35px;
    }

    .recyclable {
        color: #4f714b; /* Color for recyclable items */
    }

    .non-recyclable {
        color: #ad504d; /* Color for non-recyclable items */
    }

    .information{
        text-align: left;
        max-width: 2000px; 
        margin: 0 auto;
        padding-left: 20px;
    }

    .information-list {
        list-style: none;
        padding-left: 0; /* Resets the default padding */
    }

    .information-list li {
        display: flex;
        align-items: center; /* Vertically centers the bullet with the text */
        text-align: left;
    }

    .information-list li::before {
        content: '•';
        color: #4f714b;
        font-weight: bold;
        display: inline-block;
        width: 1em;
        margin-left: 1em;
    }


</style>