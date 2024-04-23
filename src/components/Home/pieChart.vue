<template>
    <div>
      <div v-if="recycledData" class="pieChartContainer">
        <canvas id="recyclingChart"></canvas>
      </div>
    </div>
  </template>
  

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { faCentercode } from '@fortawesome/free-brands-svg-icons';
Chart.register(...registerables, ChartDataLabels);


export default {
    data() {
        return {
            recycledData: null,
            username: '',
            chartInstance: null,
        };
    },
    mounted() {
        this.initializeDataWithDelay();
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
                    this.fetchRecycledData();
                } else {
                    console.error("No such user!");
                }
            } else {
                console.error("No user is signed in.");
            }
        },
        async fetchRecycledData() {
            console.log("calling fetchRecycledData")
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
                this.$nextTick(() => {
                    this.drawChart();
                });
            } catch (error) {
                console.error("Error fetching recycled data:", error);
            }
        },
        drawChart() {
        if (this.recycledData) {
            const canvas = document.getElementById('recyclingChart');

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
                    labels: this.recycledData.labels,
                    datasets: [{
                        label: 'Number of Items',
                        data: this.recycledData.values,
                        backgroundColor: [
                            'rgba(121,188,217,255)',
                            'rgba(69,114,71,255)',
                            'rgba(242,215,74,255)',
                            'rgba(240,160,87,255)',
                            'rgba(207,112,30,255)'
                        ],
                        borderColor: [
                            'rgba(121,188,217,255)',
                            'rgba(69,114,71,255)',
                            'rgba(242,215,74,255)',
                            'rgba(240,160,87,255)',
                            'rgba(207,112,30,255)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1, 
                    layout: {
                        padding: {
                            top: 20,
                            right: 150,
                            bottom: 20,
                            left: 150
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        datalabels: {
                            color: '#000000', // The color of the label text
                            font: {
                                size: 14, // The size of the label font
                            },
                            anchor: 'end',
                            align: 'end',
                            offset: 20, // Offset from the edge of each pie slice
                            clamp: true, // Ensures labels are clamped to the canvas edges
                            padding: 4,
                            textAlign:'center',
                            formatter: (value, context) => {
                                if (value === 0) {
                                    return null;
                                }
                                
                                const dataArr = context.chart.data.datasets[0].data;
                                const total = dataArr.reduce((acc, curr) => acc + curr, 0);
                                const percentage = ((value / total) * 100).toFixed(1) + '%';
                                if (percentage < 5) {
                                    console.log("setting % to null")
                                    return null; 
                                }
                                return context.chart.data.labels[context.dataIndex] + ' ' + percentage;
                            },
                            // Define how the lines should look
                            borderWidth: 2, // Width of the line
                            borderColor: ctx => ctx.dataset.borderColor[ctx.dataIndex], // Color of the line
                            borderRadius: 25, // Roundness of the corners on the line
                        },

                    }
                }
            });
        }
    }
    },
    
}
</script>

<style>
    #recyclingChart {
        width: 100%;
        max-width: 1000px;
        max-height:1000px;
        display:block;
        margin:auto
    }
</style>
