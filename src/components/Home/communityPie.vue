<template>
    <div>
      <div class="regularText">You have beaten {{ percentageOfUsersBeaten.toFixed(2) }}% of users in your recycling efforts</div>
      <div v-if="percentageOfUsersBeaten" class="pieChartContainer">
        <canvas id="communityChart"></canvas>
      </div>
    </div>
  </template>
  

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels);


export default {
    data() {
        return {
            username: '',
            chartInstance: null,
            myDocumentIndex: -1, // Default index of your document
            totalUsersBeaten: 0, // Default total count of users beaten
            totalUsersNotBeaten: 0, // Default total count of users not beaten
            totalUsers: 0, // Default total count of users not beaten
            percentageOfUsersBeaten: 0, // Default percentage of users beaten
            sortedUsers: [] // Array to hold sorted users
        };
    },
    mounted() {
        this.initialiseDataWithDelay();
    },
    methods: {
        initialiseDataWithDelay() {
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
                    this.fetchAndProcessUserData();
                } else {
                    console.error("No such user!");
                }
            } else {
                console.error("No user is signed in.");
            }
        },
        async fetchAndProcessUserData() {
            try {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const usersData = usersSnapshot.docs.map(doc => doc.data());

                // Sort users based on numRecycled in descending order
                this.sortedUsers = usersData.sort((a, b) => {
                    // Treat undefined numRecycled as 0
                    const numRecycledA = a.numRecycled || 0;
                    const numRecycledB = b.numRecycled || 0;
                    return numRecycledB - numRecycledA;
                });

                // Find index of your document
                this.myDocumentIndex = this.sortedUsers.findIndex(user => user.username === this.username);
                console.log("my index" + this.myDocumentIndex)

                // Calculate total count of users and users beaten
                this.totalUsers = this.sortedUsers.length;
                this.totalUsersBeaten = this.totalUsers - this.myDocumentIndex; // Index already accounts for zero indexing
                this.totalUsersNotBeaten = this.myDocumentIndex;

                if (this.totalUsers > 0) {
                    this.percentageOfUsersBeaten = (this.totalUsersBeaten / this.totalUsers) * 100;
                } else {
                    console.error('Total users count is zero, cannot calculate percentage.');
                    this.percentageOfUsersBeaten = 0; // Optionally set to 0 or keep undefined based on your needs
                }

                this.$nextTick(() => {
                    this.drawChart();
                });

            } catch (error) {
                console.error('Error fetching and processing user data:', error);
            }
        },
        drawChart() {
            // Check if totalUsersBeaten is available
            if (typeof this.totalUsersBeaten !== 'number') {
                console.error('Users beaten data is not available.');
                return;
            }

            const canvas = document.getElementById('communityChart');

            if (!canvas) {
                console.error('Canvas element not found.');
                return;
            }

            const ctx = canvas.getContext('2d');
            if (this.chartInstance) {
                this.chartInstance.destroy();
            }
            this.chartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Users Beaten', 'Users Not Beaten'],
                    datasets: [{
                        label: 'Number of Users',
                        data: [this.totalUsersBeaten, this.totalUsersNotBeaten],
                        backgroundColor: [
                            'rgba(69,114,71,255)',
                            'rgba(242,215,74,255)',
                        ],
                        borderColor: [
                            'rgba(69,114,71,255)',
                            'rgba(242,215,74,255)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1.3,
                    layout: {
                        padding: {
                            top: 50,
                            right: 150,
                            bottom:50,
                            left: 150
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                font: {
                                    size:15,
                                },
                                boxWidth:20,
                                padding:10,
                                generateLabels: function(chart) {
                                    const data = chart.data;
                                    if (data.labels.length && data.datasets.length) {
                                        const total = data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);
                                        return data.labels.map((label, i) => {
                                            const meta = chart.getDatasetMeta(0);
                                            const style = meta.controller.getStyle(i);
                                            const value = data.datasets[0].data[i];
                                            const percentage = ((value / total) * 100).toFixed(2) + '%'; // Calculate percentage
                                            return {
                                                text: label + ': ' + percentage, 
                                                fillStyle: style.backgroundColor,
                                                strokeStyle: style.borderColor,
                                                lineWidth: style.borderWidth,
                                                hidden: isNaN(value),
                                                index: i
                                            };
                                        });
                                    } else {
                                        return [];
                                    }
                                }
                            }
                        },
                        datalabels: {
                            display:false,
                        }

                    },
                }
            });
        },
    }
}
</script>

<style>
    #communityChart {
        width: 100%;
        max-width: 1000px;
        max-height: 1000px;
        margin-top:0;
        display:block;
        margin:auto;
    }
    .regularText{
        font-size: 25px;
        text-align: center;
        color:#457247;
        font-weight:bold
    }
</style>
