<template>
    <div class="container-fluid m-0 p-0 pt-2 bg-white altezza">
        <div class="position-relative container d-flex">
            <button class="btn btn-secondary">
                <router-link class="text-decoration-none text-light" to="/">
                    <i class="fa-solid fa-arrow-left"></i>
                </router-link>
            </button>
            <h2 class="text-success container my-0">
                Risultati della Ricerca per {{ specialization }}: {{ filteredDoctors.length }}
            </h2>
        </div>

        <div v-if="loading">Caricamento...</div>
        <div v-else-if="error">Errore: {{ error }}</div>
        <div v-else>
            <!-- Jumbotron per le Specializzazioni -->
            <div class="container my-4 text-dark jumbotron p-4 shadow">
                <h3 class="mb-3">Filtra per Specializzazioni</h3>
                <div class="specializations-container">
                    <div class="row">
                        <div class="col-md-4 mb-3" v-for="specialization in specializations" :key="specialization.id">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" :id="specialization.id"
                                    :value="specialization.name" v-model="selectedSpecializations" />
                                <label class="form-check-label" :for="specialization.id">
                                    {{ specialization.name }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary mt-3" @click="handleSearch">Filtra</button>
            </div>

            <!-- Visualizza i dettagli del dottore -->
            <div class="container-sm">
                <div class="row text-dark">
                    <div class="col-12 col-md-6 col-lg-4 py-2" v-for="doctor in filteredDoctors" :key="doctor.id">
                        <div class="border p-3 bg-light rounded d-flex flex-column h-100 justify-content-between">
                            <div class="d-flex justify-content-center mb-3 position-relative">
                                <img v-if="doctor.pic" :src="`${base_url}/storage/images/${doctor.pic}`"
                                    alt="Immagine del dottore" class="img-fluid" @error="handleImageError" />
                                <img v-else
                                    src="https://i.pinimg.com/736x/ac/67/4d/ac674d2be5f98abf1c189c75de834155.jpg"
                                    alt="Immagine del dottore" class="img-fluid" />
                                <p v-if="doctor.sponsorships && doctor.sponsorships.length"
                                    class="d-flex align-items-center m-0 p-0 text-center position-absolute top-25 end-0 sponsor gold p-2 rounded-pill">
                                    Sponsorizzato {{ doctor.sponsorships[0]?.name }}
                                </p>
                            </div>

                            <div class="d-flex justify-content-between">
                                <h2>{{ doctor.surname || 'Nome non disponibile' }}</h2>
                            </div>
                            <p>Indirizzo: {{ doctor.address || 'Indirizzo non disponibile' }}</p>
                            <p>Telefono: {{ doctor.phone || 'Telefono non disponibile' }}</p>
                            <p>Bio: {{ doctor.bio || 'Bio non disponibile' }}</p>

                            <!-- Recensioni -->
                            <div class="review-stars">
                                <h3>Valutazione Media:</h3>
                                <div v-if="doctor.reviews_avg_stars !== undefined && doctor.reviews_avg_stars !== null">
                                    <div>
                                        <i class="fa-solid fa-star" v-for="i in 5"
                                            :class="{ 'opacity-100': getRating(doctor.reviews_avg_stars) >= i - 1, 'opacity-50': getRating(doctor.reviews_avg_stars) < i - 1 }"></i>
                                    </div>
                                    <p>{{ parseFloat(doctor.reviews_avg_stars).toFixed(1) }} su 5</p>
                                </div>
                                <div v-else>
                                    <p>Nessuna recensione disponibile</p>
                                </div>
                            </div>

                            <!-- Specializzazioni -->
                            <h3 v-if="doctor.specializations && doctor.specializations.length > 0">
                                Specializzazioni:
                            </h3>
                            <ul v-if="doctor.specializations && doctor.specializations.length > 0">
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
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            doctors: [],
            filteredDoctors: [],
            selectedSpecializations: [],
            loading: true,
            error: null,
            base_url: 'http://127.0.0.1:8000',
            specializations: [],
        };
    },
    computed: {
        // Computed che restituisce i parametri della query
        params() {
            return this.$route.query;
        },
        specialization() {
            // Se i parametri sono un array, come nel caso di `specializations[]`
            return this.$route.query['specializations[]'] || 'Nessuna specializzazione trovata';
        }
    },
    async created() {
        await this.fetchDoctors();
        await this.fetchSpecializations();
    },
    methods: {
        handleImageError(event) {
            event.target.src = 'https://i.pinimg.com/736x/ac/67/4d/ac674d2be5f98abf1c189c75de834155.jpg';
        },
        getRating(rating) {
            return Math.round(rating / 2);
        },
        async fetchDoctors() {
            try {
                // Carica tutti i dottori
                const response = await axios.get(`${this.base_url}/api/doctors`);
                console.log('Dati dei dottori:', response.data);

                // Salva tutti i dottori nella variabile principale
                this.doctors = response.data;

                // Filtra inizialmente solo i dottori sponsorizzati
                this.filteredDoctors = this.doctors.filter(doctor => doctor.sponsorships && doctor.sponsorships.length > 0);
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
                console.error('Errore nel recupero delle specializzazioni:', error);
                this.error = 'Errore nel recupero delle specializzazioni.';
            }
        },
        handleSearch() {
            // Aggiorna la query con le specializzazioni selezionate
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

            // Filtra i dottori in base alla specializzazione selezionata
            this.filterDoctorsBySpecialization();
        },
        filterDoctorsBySpecialization() {
            if (this.selectedSpecializations.length > 0) {
                // Filtra i dottori in base alle specializzazioni selezionate, includendo tutti i dottori (sponsorizzati e non)
                this.filteredDoctors = this.doctors.filter(doctor =>
                    doctor.specializations && doctor.specializations.some(specialization =>
                        this.selectedSpecializations.includes(specialization.name)
                    )
                );
            } else {
                // Se non ci sono specializzazioni selezionate, torna a mostrare solo i dottori sponsorizzati
                this.filteredDoctors = this.doctors.filter(doctor => doctor.sponsorships && doctor.sponsorships.length > 0);
            }
        },
        goToDoctorDetail(slug) {
            this.$router.push({ name: 'doctorDetail', params: { slug } });
        },
    },
};
</script>

<style scoped>
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

.altezza {
    min-height: 50vh;
}
</style>
