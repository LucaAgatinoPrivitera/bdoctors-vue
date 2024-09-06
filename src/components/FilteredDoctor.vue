<template>
    <div class="container-fluid m-0 p-0 bg-white">
        <!-- ... altre parti del template ... -->

        <div class="container" v-if="loading">Caricamento...</div>
        <div class="container" v-else-if="error">Errore: {{ error }}</div>
        <div v-else class="container-fluid bg-white py-4">
            <div class="container">
                <div class="row text-dark">
                    <div v-if="filteredDoctors && filteredDoctors.length > 0">
                        <div class="col-12 col-md-6 col-lg-4 py-2" v-for="doctor in filteredDoctors" :key="doctor.id">
                            <div class="border p-3 bg-light rounded d-flex flex-column h-100 justify-content-between">
                                <div class="d-flex justify-content-center mb-3">
                                    <img v-if="doctor.pic" :src="`${base_url}/storage/images/${doctor.pic}`"
                                        alt="Immagine del dottore" class="img-fluid" @error="handleImageError" />
                                    <img v-else
                                        src="https://i.pinimg.com/736x/ac/67/4d/ac674d2be5f98abf1c189c75de834155.jpg"
                                        alt="Immagine del dottore" class="img-fluid" />
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
                    <div v-else>
                        Nessun dottore trovato.
                    </div>
                </div>
            </div>

            <div class="container">
                <button @click="loadPrev" v-if="doctors.current_page > 1" class="btn btn-secondary">
                    Carica precedenti
                </button>
                <button @click="loadMore" v-if="doctors.current_page < doctors.last_page" class="btn btn-secondary">
                    Carica altro
                </button>
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
            // Recupera i parametri della query dalla route
            const params = new URLSearchParams(this.$route.query);

            try {
                const response = await axios.get(`${this.base_url}/api/doctors`, { params });
                console.log('Dati filtrati dei dottori:', response.data);
                this.filteredDoctors = response.data.data || []; // Assicurati che data sia sempre un array
                this.doctors = response.data;
            } catch (error) {
                console.error('Errore:', error);
                this.error = 'Errore nel recupero dei dati.';
            } finally {
                this.loading = false;
            }
        }
        ,
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
