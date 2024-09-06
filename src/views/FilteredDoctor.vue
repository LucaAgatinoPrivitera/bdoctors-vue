<template>
    <div>
        <h1>Risultati della Ricerca</h1>
        <div v-if="loading">Caricamento...</div>
        <div v-else-if="error">Errore: {{ error }}</div>
        <div v-else>
            <div v-for="doctor in filteredDoctors" :key="doctor.id">
                <!-- Visualizza i dettagli del dottore -->
                <div>
                    <h2>{{ doctor.surname }}</h2>
                    <!-- Altri dettagli del dottore -->
                </div>
            </div>
        </div>
    </div>
</template>




<script>
import axios from 'axios';

export default {
    data() {
        return {
            filteredDoctors: [],
            loading: true,
            error: null,
            base_url: 'http://127.0.0.1:8000',
            specializations: [],
        };
    },
    async created() {
        await this.fetchDoctors();
        await this.fetchSpecializations();
    },
    methods: {
        async fetchDoctors() {
            const params = this.$route.query; // Usa i parametri della query direttamente
            try {
                const response = await axios.get(`${this.base_url}/api/doctors`, { params });
                this.filteredDoctors = response.data.data; // Assumi che i dati dei dottori siano in response.data.data
            } catch (error) {
                console.error('Errore:', error);
                this.error = 'Errore nel recupero dei dati.';
            } finally {
                this.loading = false;
            }
        },
        async fetchSpecializations() {
            try {
                const response = await axios.get(`${this.base_url}/api/specializations`);
                this.specializations = response.data;
            } catch (error) {
                console.error('Errore:', error);
                this.error = 'Errore nel recupero delle specializzazioni.';
            }
        },
    }
};
</script>