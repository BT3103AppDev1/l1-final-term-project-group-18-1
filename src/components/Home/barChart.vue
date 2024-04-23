<template>
    <div class="bar-chart-container">
      <canvas id="myBarChart"></canvas>
    </div>
  </template>


<script>
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
    import { db } from '@/firebaseConfig';
    import { Chart, registerables } from 'chart.js';
    import ChartDataLabels from 'chartjs-plugin-datalabels';
    Chart.register(ChartDataLabels);

    Chart.register(...registerables);


    export default {
        data() {
            return {
                monthlyData: null,
                username: '',
                chartInstance: null,
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
                        this.fetchData();
                    } else {
                        console.error("No such user!");
                    }
                } else {
                    console.error("No user is signed in.");
                }
            }, 
            async fetchData() { 
                const queryRef = collection(db, 'recycledDataSummary'); // Reference to the collection
                const q = query(queryRef, where('username', '==', this.username)); // Create a query against the collection
                try {
                    const querySnapshot = await getDocs(q); //execute the query
                    if (querySnapshot.empty) {
                        console.log("No data available for this user.");
                    } else {
                        console.log("retreived data working with it now.");
                        querySnapshot.forEach((doc) => {
                            const userData = doc.data();
                            this.monthlyData = {
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                                values: [
                                    userData.JanuaryCount || 0,
                                    userData.FebruaryCount || 0,
                                    userData.MarchCount || 0,
                                    userData.AprilCount || 0,
                                    userData.MayCount || 0,
                                    userData.JuneCount || 0,
                                    userData.JulyCount || 0,
                                    userData.AugustCount || 0,
                                    userData.SeptemberCount || 0,
                                    userData.OctoberCount || 0,
                                    userData.NovemberCount || 0,
                                    userData.DecemberCount || 0
                                ]

                            };
                            console.log('Fetched data:', this.monthlyData);
                        });
                    }  
                    this.$nextTick(() => {
                        this.drawChart();
                    });
                } catch (error) {
                    console.error("Error fetching recycled data:", error);
                }
            },
            drawChart() {
            // Ensure we have the data needed to draw the chart
            if (this.monthlyData) {
                // If a chart instance already exists, destroy it before creating a new one
                if (this.chartInstance) {
                    this.chartInstance.destroy();
                }

                const ctx = document.getElementById('myBarChart').getContext('2d');
                this.chartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: this.monthlyData.labels,
                        datasets: [{
                        label: 'Items Recycled',
                        data: this.monthlyData.values,
                        backgroundColor: '#457247', 
                        borderColor: '#457247', 
                        borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#666', // Change this to the color you want for the tick labels
                                font: {
                                size: 14, 
                                },
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)', 
                            }
                            },
                            x: {
                            title: {
                                display: true,
                                text: 'Month', // Your y-axis title here
                                font: {
                                    size: 18
                                }
                            },
                            ticks: {
                                color: '#666', // Change this to the color you want for the tick labels
                                font: {
                                size: 14, 
                                },  
                            },
                            grid: {
                                display: false, // This will hide the x-axis grid lines
                            },
                            }
                        },
                        plugins: {
                            legend: {
                            display: true,
                            labels: {
                                color: '#666', // This will set the legend label color
                                font:{
                                    size: 18,
                                }    
                            }
                            },
                            datalabels: {
                            color: '#666', // choose a color that stands out on your bars
                            display: function(context) {
                                // Only display labels for data points with a value not equal to 0
                                return context.dataset.data[context.dataIndex] !== 0;
                            },
                            formatter: function(value, context) {
                                // This function formats the label. You can define your own formatting here.
                                return value;
                            },
                            anchor: 'end', // Aligns the label above the top of the bar
                            align: 'top', // Positions the label at the top of the bar
                            font: {
                                weight: 'bold', // Makes the label bold
                            }
                            },
                            title: {
                                display: true,
                                text: 'Your Contributions for This Year', // Your chart title here
                                padding: 20,
                                color: '#457247',
                                font: {
                                    size: 25,
                                }
                            },
                        },
                        
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 1.3, 
                    }

                });
            }
            },
        },
}
</script>

<style scoped>
    .bar-chart-container {
    width: 100%;
    max-width: 1000px;
    max-height: 1000px;
    margin: auto;
    }
</style>

