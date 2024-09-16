<script>
import axios from 'axios';

export default {
    props: ['id'],
    data() {
        return {
            doctor: null,
            loading: true,
            error: null,
            base_url: 'http://127.0.0.1:8000',
            showReviewForm: false,
            showContactForm: false,
            contactForm: {
                name: '',
                email: '',
                message: '',
                doctor_id: ''
            },
            reviewForm: {
                name_reviewer: '',
                email_reviewer: '',
                stars: 0,
                review_text: '',
                doctor_id: ''
            },

            snackbar: false,
            snackbarText: '',

        };
    },
    async created() {
        await this.fetchDoctor();
    },
    methods: {
        async fetchDoctor() {
            const slug = this.$route.params.slug.toLowerCase();
            try {
                const response = await axios.get(`${this.base_url}/api/doctors/${slug}`);
                this.doctor = response.data;
                console.log(this.doctor.reviews); // Controlla se le recensioni sono presenti
            } catch (error) {
                console.error('Errore:', error);
                this.error = 'Errore nel recupero dei dati.';
            } finally {
                this.loading = false;
            }
        },
        setRating(stars) {
            this.reviewForm.stars = stars;
        },
        async submitReview() {
            this.reviewForm.doctor_id = this.doctor.id;
            try {
                await axios.post(`${this.base_url}/api/reviews`, this.reviewForm);
                this.snackbarText = "Recensione inviata con successo!";
                this.snackbar = true;
                this.showReviewForm = false;
                // Reset del form dopo l'invio
                this.reviewForm = {
                    name_reviewer: '',
                    email_reviewer: '',
                    stars: 0,
                    review_text: '',
                    doctor_id: ''
                };

                setTimeout(() => {
                    this.snackbar = false;
                }, 3000);

            } catch (error) {
                this.snackbarText = "Errore durante l'invio della recensione.";
                this.snackbar = true;
            }
        },
        async sendMessage() {
            this.contactForm.doctor_id = this.doctor.id;
            try {
                await axios.post(`${this.base_url}/api/messages`, this.contactForm);
                this.snackbarText = "Messaggio inviato con successo!";
                this.snackbar = true;
                this.showContactForm = false;
                // Reset del form dopo l'invio
                this.contactForm = {
                    name: '',
                    email: '',
                    message: '',
                    doctor_id: ''
                };

                setTimeout(() => {
                    this.snackbar = false;
                }, 3000);

            } catch (error) {
                console.error('Errore:', error);
            }
        }
    }
};
</script>

<template>
    <div class="container-fluid bg-white p-4 min-height">
        <div v-if="loading" class="text-center">
            <p class="loading-message">Caricamento...</p>
        </div>
        <div v-else-if="error" class="text-center text-danger">
            <p>Errore: {{ error }}</p>
        </div>
        <div v-else class="container text-dark p-4 rounded shadow">

            <div class="d-flex align-items-center gap-4">
                <button class="btn btn-secondary">
                    <i class="fa fa-arrow-left" @click="$router.go(-1)"></i>
                </button>

                <h1 class="doctor-name display-4 text-info">{{ doctor.surname + ' ' + doctor.user.name }}</h1>
            </div>


            <div class="doctor-info d-flex align-items-center my-4">
                <img v-if="doctor.pic" :src="`${base_url}/storage/images/${doctor.pic}`" alt="Immagine del dottore"
                    class="img-fluid me-2" style="width: 200px; border-radius: 20px;" @error="handleImageError" />
                <img v-else src="https://i.pinimg.com/736x/ac/67/4d/ac674d2be5f98abf1c189c75de834155.jpg"
                    alt="Immagine del dottore" class="img-fluid me-2 rounded-circle" style="width: 200px;" />
                <div>
                    <p><strong>Indirizzo:</strong> {{ doctor.address }}</p>
                    <p><strong>Telefono:</strong> {{ doctor.phone }}</p>
                    <p><strong>Bio:</strong> {{ doctor.bio }}</p>
                </div>
            </div>
            <h3 class="specializations-title text-info">Specializzazioni:</h3>
            <ul class="specializations-list list-unstyled">
                <li v-for="specialization in doctor.specializations" :key="specialization.id"
                    class="specialization-item">
                    {{ specialization.name }}
                </li>
            </ul>
            <!-- Sezioni per Recensione e Contatto -->
            <div class="actions mt-4">
                <button class="btn btn-primary me-2" @click="showContactForm = !showContactForm">Contatta</button>
                <button class="btn btn-secondary" @click="showReviewForm = !showReviewForm">Lascia una
                    Recensione</button>
            </div>

            <div>
                <h3 class="reviews-title text-info">Recensioni:</h3>
                <ul v-if="doctor.reviews && doctor.reviews.length > 0" class="reviews-list list-unstyled">
                    <li v-for="review in doctor.reviews" :key="review.id" class="review-item mb-3">
                        <strong>{{ review.name_reviewer }} -
                            <span v-for="n in review.stars" :key="n">
                                <i class="fa-solid fa-star text-warning"></i>
                            </span>
                        </strong>
                        <p>{{ review.review_text }}</p>
                    </li>
                </ul>
                <p v-else>Nessuna recensione disponibile.</p>
            </div>

            <!-- Modulo di Contatto -->
            <div v-if="showContactForm" class="contact-container mt-4">
                <div class="contact-content">
                    <h2>Contatta il Medico</h2>

                    <form @submit.prevent="sendMessage" class="contact-form">

                        <div class="mb-3">
                            <label for="name" class="form-label">Nome</label>
                            <input type="text" id="name" v-model="contactForm.name" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" id="email" v-model="contactForm.email" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="message" class="form-label">Messaggio</label>
                            <textarea id="message" v-model="contactForm.message" rows="4" class="form-control"
                                required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Invia Messaggio</button>
                    </form>

                </div>
            </div>

            <!-- Modulo di Recensione -->
            <div v-if="showReviewForm" class="review-container mt-4">
                <div class="form-wrapper">
                    <h2>Lascia una Recensione</h2>
                    <form @submit.prevent="submitReview">

                        <div class="mb-3">
                            <label for="name" class="form-label">Nome</label>
                            <input type="text" id="name" v-model="reviewForm.name_reviewer" class="form-control"
                                required />
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" id="email" v-model="reviewForm.email_reviewer" class="form-control"
                                required />
                        </div>
                        <div class="mb-3">
                            <label for="rating" class="form-label">Voto</label>
                            <div class="star-rating">
                                <span v-for="n in 5" :key="n" :class="{ 'filled-star': n <= reviewForm.stars }"
                                    @click="setRating(n)">&#9733;</span>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="review" class="form-label">Recensione</label>
                            <textarea id="review" v-model="reviewForm.review_text" class="form-control" rows="4"
                                required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Invia Recensione</button>
                    </form>
                </div>
            </div>
        </div>
        <router-link class="back-home btn btn-outline-light mt-3" to="/">Torna alla home</router-link>
        <v-snackbar v-model="snackbar" :timeout="3000" class="custom-snackbar">
            {{ snackbarText }}
        </v-snackbar>
    </div>


</template>

<style scoped>
h1 {
    color: #008080 !important;
}

h3 {
    color: #613719 !important;
}

.doctor-detail {
    max-width: 900px;
    margin: 0 auto;
}

.min-height {
    min-height: 80vh;
}

.review-container,
.contact-container {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    color: black;
}

.star-rating {
    font-size: 2rem;
    color: #ddd;
    cursor: pointer;
}

.star-rating .filled-star {
    color: #ffcc00;
}

.loading-message {
    font-size: 1.5rem;
    color: #f0ad4e;
}

.doctor-card {
    background-color: #2c3e50;
}

.doctor-name {
    font-weight: bold;
}

.doctor-info {
    display: flex;
    flex-wrap: wrap;
}

.doctor-img {
    width: 150px;
    height: 150px;
    object-fit: cover;
}

.specializations-title {
    margin-top: 20px;
}

.specializations-list {
    padding-left: 0;
}

.specialization-item {
    font-size: 1.2rem;
    margin: 5px 0;
}

.actions .btn {
    font-size: 1rem;
}

.back-home {
    display: inline-block;
    margin-top: 20px;
}

.alert-success {
    background-color: #d4edda;
    color: #155724;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
}

.custom-snackbar {
    background-color: green;
    /* Cambia il colore di sfondo */
    color: white;
    /* Cambia il colore del testo */
    font-weight: bold;
    /* Rende il testo più evidente */
    border-radius: 5px;

}



@media (max-width: 768px) {
    .doctor-info {
        flex-direction: column;
        align-items: center;
    }

    .doctor-img {
        margin-bottom: 20px;
    }
}
</style>