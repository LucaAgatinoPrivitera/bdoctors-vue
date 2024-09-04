<script>
import axios from 'axios';

export default {
    data() {
        return {
            doctors: { data: [] }, // Inizializzato come oggetto con data come array
            filteredDoctors: [], // Inizializzato come array vuoto
            loading: true,
            error: null,
            base_url: 'http://127.0.0.1:8000',
            page: 1,
            perPage: 10,
            searchQuery: ''
        };
    },
    async created() {
        await this.fetchDoctors();
    },
    methods: {
        async fetchDoctors() {
            try {
                const response = await axios.get(`${this.base_url}/api/doctors`);
                console.log('Response Data:', response.data); // Controlla se le specializzazioni sono presenti
                this.doctors = response.data;
                this.filteredDoctors = this.doctors;
            } catch (error) {
                console.error('Errore:', error);
                this.error = 'Errore nel recupero dei dati.';
            } finally {
                this.loading = false;
            }
        }
        ,
        filterDoctors(query) {
            console.log('Search Query:', query);
            console.log('Doctors before filtering:', this.doctors);

            if (query) {
                this.filteredDoctors = this.doctors.filter(doctor => {
                    console.log('Checking doctor:', doctor);
                    return doctor.specializations && Array.isArray(doctor.specializations) &&
                        doctor.specializations.some(specialization => {
                            console.log('Checking specialization:', specialization);
                            return specialization.name.toLowerCase().includes(query.toLowerCase());
                        });
                });
                console.log('Filtered Doctors:', this.filteredDoctors);
            } else {
                this.filteredDoctors = this.doctors;
            }
        },
        async loadMore() {
            this.page++;
            await this.fetchDoctors();
        },
        async loadPrev() {
            this.page--;
            await this.fetchDoctors();
        },
        handleSearch() {
            this.filterDoctors(this.searchQuery);
        },
        handleKeypress(event) {
            if (event.key === 'Enter') {
                this.handleSearch();
            }
        },
        goToDoctorDetail(id) {
            this.$router.push({ name: 'doctorDetail', params: { id } });
        }
    },
    mounted() {
        document.title = 'Lista dei Dottori';
    }
};
</script>

<template>
    <div class="container-fluid m-0 p-0 bg-white">
        <div>
            <h1 class="container text-success">Lista dei Dottori</h1>
        </div>

        <div class="container mb-4 d-flex">
            <input type="text" class="form-control me-2" v-model="searchQuery" @keypress="handleKeypress"
                placeholder="Cerca per specializzazione..." />
            <button class="btn btn-primary" @click="handleSearch">
                Cerca
            </button>
        </div>

        <div class="container" v-if="loading">Caricamento...</div>
        <div class="container" v-else-if="error">Errore: {{ error }}</div>
        <div v-else class="container-fluid bg-white py-4">

            <div class="container">
                <div class="row text-dark">
                    <div class="col-2 py-2" v-for="doctor in filteredDoctors" :key="doctor.id">
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
                            <button class="btn btn-info mt-2" @click="goToDoctorDetail(doctor.id)">
                                Visualizza Dettagli
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container">
                <button @click="loadPrev" v-if="doctors.current_page > 1">Carica precedenti</button>
                <button @click="loadMore" v-if="doctors.current_page < doctors.last_page">Carica altro</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.img-fluid {
    max-width: 100%;
    height: auto;
}
</style>