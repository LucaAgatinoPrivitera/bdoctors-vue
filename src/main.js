import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'; // Servivano le parentesi graffe perché non funziona
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importa Font Awesome


const app = createApp(App)

app.use(router)

app.mount('#app')


