<template>
    <div class="container-fluid m-0 p-0 pt-2 bg-white">
        <div class="position-relative container d-flex">
            <button class="btn btn-secondary"><router-link class="text-decoration-none text-light " to="/"><i
                        class="fa-solid fa-arrow-left"></i></router-link>
            </button>
            <h2 class="text-success container my-0">Risultati della Ricerca</h2>
        </div>

        <div v-if="loading">Caricamento...</div>
        <div v-else-if="error">Errore: {{ error }}</div>
        <div v-else>

            <!-- Visualizza i dettagli del dottore -->
            <div>
                <div class="container">
                    <div class="row text-dark">
                        <div class="col-12 col-md-6 col-lg-4 py-2" v-for="doctor in filteredDoctors" :key="doctor.id">
                            <div class="border p-3 bg-light rounded d-flex flex-column h-100 justify-content-between">
                                <div class="d-flex justify-content-center mb-3">
                                    <img v-if="doctor.pic" :src="`${base_url}/storage/images/${doctor.pic}`"
                                        alt="Immagine del dottore" class="img-fluid" @error="handleImageError" />
                                    <img v-else
                                        src="https://i.pinimg.com/736x/ac/67/4d/ac674d2be5f98abf1c189c75de834155.jpg"
                                        alt="Immagine del dottore" class="img-fluid" />
                                </div>
                                <h2>{{ doctor.surname || 'Nome non disponibile' }}</h2>
                                <p>Indirizzo: {{ doctor.address || 'Indirizzo non disponibile' }}</p>
                                <p>Telefono: {{ doctor.phone || 'Telefono non disponibile' }}</p>
                                <p>Bio: {{ doctor.bio || 'Bio non disponibile' }}</p>
                                <p>{{ doctor.reviews.stars }}</p>

                                <!-- Aggiungi qui la sezione per le recensioni -->
                                <div class="review-stars">
                                    <h3>Valutazione Media:</h3>
                                    <div
                                        v-if="doctor.reviews_avg_stars !== undefined && doctor.reviews_avg_stars !== null">
                                        <div class="">
                                            <i class="fa-solid fa-star right opacity-100"
                                                v-if="getRating(doctor.reviews_avg_stars) >= 0"></i>
                                            <i class="fa-solid fa-star right opacity-50" v-else></i>

                                            <i class="fa-solid fa-star right opacity-100"
                                                v-if="getRating(doctor.reviews_avg_stars) >= 1"></i>
                                            <i class="fa-solid fa-star right opacity-50" v-else></i>

                                            <i class="fa-solid fa-star right opacity-100"
                                                v-if="getRating(doctor.reviews_avg_stars) >= 2"></i>
                                            <i class="fa-solid fa-star right opacity-50" v-else></i>

                                            <i class="fa-solid fa-star right opacity-100"
                                                v-if="getRating(doctor.reviews_avg_stars) >= 3"></i>
                                            <i class="fa-solid fa-star right opacity-50" v-else></i>

                                            <i class="fa-solid fa-star right opacity-100"
                                                v-if="getRating(doctor.reviews_avg_stars) >= 4"></i>
                                            <i class="fa-solid fa-star right opacity-50" v-else></i>
                                        </div>
                                        <p>{{ parseFloat(doctor.reviews_avg_stars).toFixed(1) }} su 5</p>
                                    </div>
                                    <div v-else>
                                        <p>Nessuna recensione disponibile</p>
                                    </div>
                                </div>

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
        handleImageError(event) {
            event.target.src = 'https://i.pinimg.com/736x/ac/67/4d/ac674d2be5f98abf1c189c75de834155.jpg';
        },
        getStarClass(starIndex, rating) {
            console.log('Star Index:', starIndex, 'Rating:', rating);
            // Assicurati che rating sia un numero
            const numericRating = parseFloat(rating);
            return starIndex <= Math.floor(numericRating) ? 'fas fa-star' : 'far fa-star';
        },
        getRating(rating) {
            let newVote = rating / 2
            newVote = newVote.toFixed(2)
            newVote = Math.round(newVote)

            /* metodo vecchio
            let x = this.store.filmRequest.vote_average;
            console.log("x vale", Math.round(x), "il suo tipo è", typeof x);
            */
            return newVote;
        },
        async fetchDoctors() {
            const params = this.$route.query;
            console.log('Parametri della query:', params);

            try {
                const response = await axios.get(`${this.base_url}/api/doctors`, { params });
                console.log('Dati dei dottori:', response.data);

                // Assicurati che 'data' esista e sia un array
                if (response.data && Array.isArray(response.data)) {
                    this.filteredDoctors = response.data;
                } else {
                    console.warn('Dati dei dottori non validi:', response.data);
                    this.filteredDoctors = [];
                }
            } catch (error) {
                console.error('Errore:', error);
                this.error = 'Errore nel recupero dei dati.';
            } finally {
                this.loading = false;
            }
        },
        goToDoctorDetail(slug) {
            this.$router.push({ name: 'doctorDetail', params: { slug } });
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
    },
};
</script>
