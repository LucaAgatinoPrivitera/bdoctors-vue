<template>
    <div class="container-fluid m-0 p-0 pt-2 bg-white">
        <div>
            <h2 class="container text-success">Lista dei Dottori</h2>
        </div>

        <!-- Jumbotron per le Specializzazioni -->
        <div class="container mb-4 text-dark jumbotron p-4 shadow">
            <h3 class="mb-3">Filtra per Specializzazioni</h3>
            <div class="specializations-container">
                <div class="row">
                    <div class="col-md-4 mb-3" v-for="specialization in specializations" :key="specialization.id">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" :id="specialization.id"
                                :value="specialization.name" v-model="selectedSpecializations" />
                            <label class="form-check-label" :for="specialization.id">{{ specialization.name }}</label>
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn btn-primary mt-3" @click="handleSearch">Filtra</button>
        </div>

        <div class="container" v-if="loading">Caricamento...</div>
        <div class="container" v-else-if="error">Errore: {{ error }}</div>
        <div v-else class="container-fluid bg-white py-4">
            <div class="container-sm">
                <div class="row text-dark">
                    <div class="col-12 col-md-6 col-lg-4 py-2 mb-4" v-for="doctor in filteredDoctors" :key="doctor.id">
                        <div class="border p-3 bg-light rounded d-flex flex-column h-100 justify-content-between">
                            <div class="d-flex justify-content-center mb-3 position-relative">
                                <img v-if="doctor.pic" :src="`${base_url}/storage/images/${doctor.pic}`"
                                    alt="Immagine del dottore" class="img-fluid" @error="handleImageError" />
                                <img v-else
                                    src="https://i.pinimg.com/736x/ac/67/4d/ac674d2be5f98abf1c189c75de834155.jpg"
                                    alt="Immagine del dottore" class="img-fluid" />
                                <p v-if="doctor.sponsorships[0]?.name == 'Gold'"
                                    class="d-flex align-items-center m-0 p-0 text-center position-absolute top-25 end-0 sponsor gold p-2 rounded-pill">
                                    Sponsorizzato
                                    {{ doctor.sponsorships[0]?.name }}</p>

                                <p v-if="doctor.sponsorships[0]?.name == 'Premium'"
                                    class="d-flex align-items-center m-0 p-0 text-center position-absolute top-25 end-0 sponsor premium p-2 rounded-pill">
                                    Sponsorizzato
                                    {{ doctor.sponsorships[0]?.name }}</p>

                                <p v-if="doctor.sponsorships[0]?.name == 'Basic'"
                                    class="d-flex align-items-center m-0 p-0 text-center position-absolute top-25 end-0 sponsor basic p-2 rounded-pill text-light">
                                    Sponsorizzato
                                    {{ doctor.sponsorships[0]?.name }}</p>

                            </div>
                            <div class="d-flex justify-content-between">
                                <h2>{{ doctor.surname }}</h2>
                                <!-- <p class="d-flex align-items-center m-0 p-0 text-center">Sponsorizzato
                                    {{ doctor.sponsorships[0]?.name }}</p> -->
                            </div>

                            <p>Indirizzo: {{ doctor.address }}</p>
                            <p>Telefono: {{ doctor.phone }}</p>
                            <p>Bio: {{ doctor.bio }}</p>

                            <h3>Specializzazioni:
                            </h3>
                            <div v-if="doctor.specializations.length === 0">
                                <p>Nessuna specializzazione</p>
                            </div>
                            <ul v-else>
                                <li v-for="specialization in doctor.specializations" :key="specialization.id">
                                    {{ specialization.name }}
                                </li>
                            </ul>
                            <button class="btn btn-info mt-2" @click="goToDoctorDetail(doctor.slug)">
                                Visualizza Dettagli
                            </button>
                        </div>
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
            doctors: { data: [] },
            filteredDoctors: [],
            specializations: [], // Aggiungi la variabile per le specializzazioni
            selectedSpecializations: [], // Aggiungi la variabile per le specializzazioni selezionate
            loading: true,
            error: null,
            base_url: 'http://127.0.0.1:8000',
            page: 1,
            perPage: 10,
            searchQuery: '',
            showSpecializations: true // Imposta a true per mostrare subito le specializzazioni
        };
    },
    async created() {
        await this.fetchDoctors();
        await this.fetchSpecializations(); // Carica le specializzazioni quando il componente viene creato
    },
    methods: {
        async fetchDoctors() {
            const params = new URLSearchParams(this.$route.query);
            try {
                const response = await axios.get(`${this.base_url}/api/doctors`, { params });
                console.log('Dati della risposta:', response.data); // Aggiungi questo log per controllare la struttura dei dati
                this.doctors = response.data; // Se response.data è l'intero oggetto, assegnalo a this.doctors
                this.filteredDoctors = response.data || []; // Verifica se è un array di medici
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
                console.log('Specializzazioni:', response.data);
                this.specializations = response.data;
            } catch (error) {
                console.error('Errore nel recupero delle specializzazioni:', error);
                this.error = 'Errore nel recupero delle specializzazioni.';
            }
        },
        filterDoctorsBySpecialization() {
            if (this.selectedSpecializations.length > 0) {
                this.filteredDoctors = this.doctors.data.filter(doctor =>
                    doctor.specializations && doctor.specializations.some(specialization =>
                        this.selectedSpecializations.includes(specialization.name)
                    )
                );
            } else {
                this.filteredDoctors = this.doctors.data;
            }
        },
        async loadMore() {
            this.page++;
            await this.fetchDoctors();
        },
        async loadPrev() {
            if (this.page > 1) {
                this.page--;
                await this.fetchDoctors();
            }
        },
        handleSearch() {
            const params = new URLSearchParams();
            this.selectedSpecializations.forEach(specialization => {
                params.append('specializations[]', specialization);
            });

            this.$router.push({
                name: 'search',
                query: {
                    ...Object.fromEntries(params)
                }
            }).catch(err => {
                console.error('Errore nel reindirizzamento:', err);
            });

            this.filterDoctorsBySpecialization(); // Aggiungi questa chiamata
        },
        handleKeypress(event) {
            if (event.key === 'Enter') {
                this.handleSearch();
            }
        },
        goToDoctorDetail(doctor) {
            // console.log(doctor)
            // this.$router.push({ name: 'doctorDetail', params: { slug: doctor } });
            const slug = doctor.toLowerCase(); // Converti lo slug in minuscolo
            this.$router.push({ name: 'doctorDetail', params: { slug } });
        },
        // lo script serve perché ogni utente ha la foto, anche se poi non esiste come file
        handleImageError(event) {
            event.target.src = 'https://i.pinimg.com/736x/ac/67/4d/ac674d2be5f98abf1c189c75de834155.jpg';
        },
    },
    mounted() {
        document.title = 'Lista dei Dottori';
    }
};
</script>

<style scoped>
.img-fluid {
    max-width: 100%;
    height: auto;
}

.jumbotron {
    background-color: #f8f9fa;
    border-radius: 0.5rem;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
    margin: 0.5rem;
}

.specializations-container {
    overflow: hidden;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.5s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
    opacity: 0;
}

.sponsor {
    top: 5%;
    right: 2.5% !important;
    background-color: rgb(206, 37, 102);
}

.gold {
    background-color: #FFD700;
}

.premium {
    background-color: #D7DEDC;
}

.basic {
    background-color: #0A8754;
}
</style>
