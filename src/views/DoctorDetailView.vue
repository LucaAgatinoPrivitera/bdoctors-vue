<script>
import axios from 'axios';

export default {
    props: ['id'],
    data() {
        return {
            doctor: null,
            loading: true,
            error: null,
            base_url: 'http://127.0.0.1:8000'
        };
    },
    async created() {
        await this.fetchDoctor();
    },
    methods: {
        async fetchDoctor() {
            try {
                const response = await axios.get(`${this.base_url}/api/doctors/${this.id}`);
                this.doctor = response.data;
            } catch (error) {
                console.error('Errore:', error);
                this.error = 'Errore nel recupero dei dati.';
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<template>
    <div class="container text-light">
        <div v-if="loading">Caricamento...</div>
        <div v-else-if="error">Errore: {{ error }}</div>
        <div v-else>
            <h1>{{ doctor.surname }}</h1>
            <img v-if="doctor.pic" :src="`${base_url}/storage/images/${doctor.pic}`" alt="Immagine del dottore">
            <p>Indirizzo: {{ doctor.address }}</p>
            <p>Telefono: {{ doctor.phone }}</p>
            <p>Bio: {{ doctor.bio }}</p>
            <h3>Specializzazioni:</h3>
            <ul>
                <li v-for="specialization in doctor.specializations" :key="specialization.id">
                    {{ specialization.name }}
                </li>
            </ul>
        </div>
        <router-link class="text-decoration-none text-light m-0 py-2 btn btn-primary text-info" to="/doctors">Torna alla lista</router-link>
    </div>
</template>