import './assets/main.css'
import VueGoogleMaps from '@fawmi/vue-google-maps';
import VueGeoLocation from 'vue-browser-geolocation';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App);

app.config.productionTip = false;
app.use(router);
// app.use(VueGeoLocation);
// app.use(VueGoogleMaps, {
//   load: {
//     key: 'VUE_APP_GOOGLE_API_KEY',
//     // other options if needed
//   },
// });

app.mount('#app');