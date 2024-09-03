<script>
import axios from 'axios';

export default {
    data() {
        return {
            doctors: {},
            loading: true,
            error: null,
            base_url: 'http://127.0.0.1:8000', // URL base per le API
            page: 1,
            perPage: 30
        };
    },
    async created() {
        await this.fetchDoctors();
    },
    methods: {
        async fetchDoctors() {
            try {
                const response = await axios.get(`${this.base_url}/api/doctors?page=${this.page}&perPage=${this.perPage}`);
                console.log(response.data); // Verifica che i dati dei dottori includano il campo `pic`
                this.doctors = response.data; // La risposta include la paginazione e i dati dei dottori
            } catch (error) {
                console.error('Errore:', error); // Log dell'errore
                this.error = 'Errore nel recupero dei dati.';
            } finally {
                this.loading = false;
            }
        },
        async loadMore() {
            this.page++;
            await this.fetchDoctors();
        }
    },
    mounted() {
        // titolo della scheda del browser
        document.title = 'Lista dei Dottori';
    }
};
</script>


<template>
    <div class="container-fluid m-0 p-0">
        <div>
            <h1 class="container text-success">Lista dei Dottori</h1>
        </div>

        <div class="container" v-if="loading">Caricamento...</div>
        <div class="container" v-else-if="error">Errore: {{ error }}</div>
        <div v-else class="container-fluid bg-white py-4">

            <div class="container">
                <div class="row text-dark">
                    <div class="col-2 py-2" v-for="doctor in doctors.data" :key="doctor.id">
                        <div class="border p-3 bg-light rounded">
                            <div class="d-flex justify-content-center mb-3">
                                <img v-if="doctor.pic" :src="`${base_url}/storage/images/${doctor.pic}`"
                                    alt="Immagine del dottore" class="img-fluid">
                            </div>
                            <h2>{{ doctor.surname }}</h2>
                            <p>Indirizzo: {{ doctor.address }}</p>
                            <p>Telefono: {{ doctor.phone }}</p>
                            <p>Bio: {{ doctor.bio }}</p>
                            <ul>
                                <li v-for="specialization in doctor.specializations" :key="specialization.id">
                                    {{ specialization.name }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


        </div>



        <!-- <ul v-else>
            <li v-for="doctor in doctors.data" :key="doctor.id">
                <h2>{{ doctor.surname }}</h2>
                <p>Indirizzo: {{ doctor.address }}</p>
                <p>Telefono: {{ doctor.phone }}</p>
                <p>Bio: {{ doctor.bio }}</p>
                <img v-if="doctor.pic" :src="`/storage/images/${doctor.pic}`" alt="Immagine del dottore" width="100">
                <ul>
                    <li v-for="specialization in doctor.specializations" :key="specialization.id">
                        {{ specialization.name }}
                    </li>
                </ul>
            </li>
        </ul> -->

        <!-- Gestione della paginazione -->
        <button @click="loadMore" v-if="doctors.current_page < doctors.last_page">Carica altro</button>
    </div>
</template>

<style scoped>
.img-fluid {
    max-width: 100%;
    /* Assicura che l'immagine non superi la larghezza del contenitore */
    height: auto;
    /* Mantieni le proporzioni */
}
</style>
