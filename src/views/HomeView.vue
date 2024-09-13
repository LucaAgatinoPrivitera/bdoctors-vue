<template>
    <div class="container-fluid m-0 p-0 pt-2 bg-white">
        <div>
            <h2 class="container text-success">Lista dei Dottori</h2>
        </div>

        <!-- Jumbotron per le Specializzazioni -->
        <div class="container mb-4 text-dark jumbotron p-4 shadow">
            <h3 class="mb-3">Filtra per Specializzazioni Voti e Recensioni</h3>
            <div class="search-container">
                <!-- Lista delle Specializzazioni -->
                <div class="col-md-12 mb-3">
                    <div class="specializations-list">
                        <span v-for="specialization in specializations" :key="specialization.id" 
                            :class="{
                                'badge-specialization': true,
                                'gold': specialization.level === 'Gold',
                                'premium': specialization.level === 'Premium',
                                'basic': specialization.level === 'Basic',
                                'selected': selectedSpecializations.includes(specialization.name)
                            }"
                            @click="toggleSpecialization(specialization.name)">
                            {{ specialization.name }}
                        </span>
                    </div>
                </div>

                <!-- Input per il numero minimo e massimo di voti -->
                <div class="col-md-6 mb-3">
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label for="min-votes">Numero Minimo di Voti:</label>
                            <input type="number" id="min-votes" v-model.number="minVotes" class="form-control" placeholder="Minimo Voti" />
                        </div>
                        <div class="col-6 mb-3">
                            <label for="max-votes">Numero Massimo di Voti:</label>
                            <input type="number" id="max-votes" v-model.number="maxVotes" class="form-control" placeholder="Massimo Voti" />
                        </div>
                    </div>
                </div>

                <!-- Input per il numero minimo e massimo di recensioni -->
                <div class="col-md-6 mb-3">
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label for="min-reviews">Numero Minimo di Recensioni:</label>
                            <input type="number" id="min-reviews" v-model.number="minReviews" class="form-control" placeholder="Minimo Recensioni" />
                        </div>
                        <div class="col-6 mb-3">
                            <label for="max-reviews">Numero Massimo di Recensioni:</label>
                            <input type="number" id="max-reviews" v-model.number="maxReviews" class="form-control" placeholder="Massimo Recensioni" />
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary mt-3" @click="handleSearch">Filtra</button>
            </div>
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
                                <p v-if="doctor.sponsorships[0]?.name === 'Gold'"
                                    class="d-flex align-items-center m-0 p-0 text-center position-absolute top-25 end-0 sponsor gold p-2 rounded-pill">
                                    Sponsorizzato {{ doctor.sponsorships[0]?.name }}</p>

                                <p v-if="doctor.sponsorships[0]?.name === 'Premium'"
                                    class="d-flex align-items-center m-0 p-0 text-center position-absolute top-25 end-0 sponsor premium p-2 rounded-pill">
                                    Sponsorizzato {{ doctor.sponsorships[0]?.name }}</p>

                                <p v-if="doctor.sponsorships[0]?.name === 'Basic'"
                                    class="d-flex align-items-center m-0 p-0 text-center position-absolute top-25 end-0 sponsor basic p-2 rounded-pill text-light">
                                    Sponsorizzato {{ doctor.sponsorships[0]?.name }}</p>
                            </div>
                            <div class="d-flex justify-content-between">
                                <h2>{{ doctor.surname }}</h2>
                            </div>

                            <p>Indirizzo: {{ doctor.address }}</p>
                            <p>Telefono: {{ doctor.phone }}</p>
                            <p>Bio: {{ doctor.bio }}</p>

                            <h3>Specializzazioni:</h3>
                            <div v-if="doctor.specializations.length === 0">
                                <p>Nessuna specializzazione</p>
                            </div>
                            <ul v-else>
                                <li v-for="specialization in doctor.specializations" :key="specialization.id" 
                                    :class="{
                                        'gold': specialization.level === 'Gold',
                                        'premium': specialization.level === 'Premium',
                                        'basic': specialization.level === 'Basic'
                                    }">
                                    {{ specialization.name }}
                                </li>
                            </ul>
                            
                            <!-- Visualizza i cerchi colorati per le stelle -->
                            <h3>Valutazione Media:</h3>
                            <div class="stars">
                                <span v-for="index in 5" :key="index" class="star-circle"
                                    :class="getStarClass(index, doctor.reviews_avg_stars)">
                                </span>
                            </div>
                            <p>{{ doctor.reviews_avg_stars !== null ? parseFloat(doctor.reviews_avg_stars).toFixed(1) : 'Nessuna recensione' }} su 5</p>

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
            doctors: [],
            filteredDoctors: [],
            specializations: [],
            selectedSpecializations: [],
            loading: true,
            error: null,
            base_url: 'http://127.0.0.1:8000',
            page: 1,
            perPage: 10,
            searchQuery: '',
            showSpecializations: true,
            showOnlySponsored: true // Flag per determinare se mostrare solo i sponsorizzati
        };
    },

    async created() {
        await this.fetchDoctors();
        await this.fetchSpecializations();
    },

    methods: {
        async fetchDoctors() {
            const params = new URLSearchParams(this.$route.query);
            try {
                const response = await axios.get(`${this.base_url}/api/doctors`, { params });
                console.log('Dati della risposta:', response.data);

                this.doctors = response.data;
                // Filtra i dottori in base al flag showOnlySponsored
                if (this.showOnlySponsored) {
                    // Mostra solo dottori con sponsorizzazioni non "None"
                    this.filteredDoctors = this.doctors.filter(doctor => {
                        return doctor.sponsorships.length > 0 && doctor.sponsorships[0].name !== 'None';
                    });
                } else {
                    // Mostra tutti i dottori
                    this.filteredDoctors = this.doctors;
                }

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
                this.filteredDoctors = this.doctors.filter(doctor =>
                    doctor.specializations && doctor.specializations.some(specialization =>
                        this.selectedSpecializations.includes(specialization.name)
                    )
                );
            } else {
                this.filteredDoctors = this.doctors;
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

            this.filterDoctorsBySpecialization();
        },

        handleKeypress(event) {
            if (event.key === 'Enter') {
                this.handleSearch();
            }
        },

        goToDoctorDetail(slug) {
            this.$router.push({ name: 'doctorDetail', params: { slug } });
        },

        handleImageError(event) {
            event.target.src = 'https://i.pinimg.com/736x/ac/67/4d/ac674d2be5f98abf1c189c75de834155.jpg';
        },

        getStarClass(index, rating) {
            if (rating === null) return 'star-circle grey'; // Nessuna recensione
            return index <= Math.round(rating) ? 'star-circle filled' : 'star-circle empty';
        },

        toggleSpecialization(name) {
            const index = this.selectedSpecializations.indexOf(name);
            if (index === -1) {
                this.selectedSpecializations.push(name);
            } else {
                this.selectedSpecializations.splice(index, 1);
            }
            this.filterDoctorsBySpecialization();
        }
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

.search-container {
    display: flex;
    flex-wrap: wrap;
}

.specializations-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.badge-specialization {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 1.5rem;
    cursor: pointer;
    font-size: 1rem;
}

.badge-specialization.gold {
    background-color: #FFD700;
    color: #000;
}

.badge-specialization.premium {
    background-color: #D7DEDC;
    color: #000;
}

.badge-specialization.basic {
    background-color: #0A8754;
    color: #fff;
}

.badge-specialization.selected {
    border: 2px solid #000;
}

.stars {
    display: flex;
    gap: 0.5rem;
}

.star-circle {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
}

.star-circle.filled {
    background-color: #f39c12; /* Colore giallo per i cerchi riempiti */
}

.star-circle.empty {
    background-color: #ddd; /* Colore grigio per i cerchi vuoti */
}

.star-circle.grey {
    background-color: #ccc; /* Colore grigio per nessuna recensione */
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
