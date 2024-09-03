import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'; // Servivano le parentesi graffe perché non funziona

const app = createApp(App)

app.use(router)

app.mount('#app')
