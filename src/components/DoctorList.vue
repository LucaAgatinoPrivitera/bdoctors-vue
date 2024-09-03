<template>
    <div>
        <h1>Lista dei Dottori</h1>
        <div v-if="loading">Caricamento...</div>
        <div v-else-if="error">Errore: {{ error }}</div>
        <ul v-else>
            <li v-for="doctor in doctors" :key="doctor.id">
                <h2>{{ doctor.surname }}</h2>
                <p>Indirizzo: {{ doctor.address }}</p>
                <p>Telefono: {{ doctor.phone }}</p>
                <p>Bio: {{ doctor.bio }}</p>
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
        };
    },
    async created() {
        try {
            const response = await axios.get('/api/doctors');
            this.doctors = response.data;
        } catch (error) {
            this.error = 'Errore nel recupero dei dati.';
        } finally {
            this.loading = false;
        }
    },
};
</script>

<style scoped>
div {
    width: 100%;
}
</style>