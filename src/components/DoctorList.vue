<template>
    <div>
        <h1>Lista dei Dottori</h1>
        <div v-if="loading">Caricamento...</div>
        <div v-else-if="error">Errore: {{ error }}</div>
        <ul v-else>
            <li v-for="doctor in doctors" :key="doctor.id">
                <h2>Nome {{ doctor.surname }}</h2>
                <!-- <p>Indirizzo: {{ doctor.address }}</p>
                <p>Telefono: {{ doctor.phone }}</p>
                <p>Bio: {{ doctor.bio }}</p> -->
                <img v-if="doctor.pic" :src="'/storage/images/' + doctor.pic" alt="Immagine del dottore" width="100">
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            doctors: [],
            loading: true,
            error: null,
            page: 1,
            perPage: 10
        };
    },
    async created() {
        await this.fetchDoctors();
    },
    methods: {
        async fetchDoctors() {
            try {
                const response = await axios.get(`/api/doctors?page=${this.page}&perPage=${this.perPage}`);
                console.log('Dati dei dottori:', response.data); // Log dei dati
                this.doctors = response.data.data; // Assumi che i dati siano in `data`
            } catch (error) {
                console.error('Errore:', error); // Log dell'errore
                this.error = 'Errore nel recupero dei dati.';
            } finally {
                this.loading = false;
            }
        }
    }
}
    ;
</script>

<style scoped>
div {
    width: 100%;
}
</style>
