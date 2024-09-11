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
            }
        };
    },
    async created() {
        await this.fetchDoctor();
    },
    methods: {
        async fetchDoctor() {
            const slug = this.$route.params.slug;
            try {
                const response = await axios.get(`${this.base_url}/api/doctors/${slug}`);
                this.doctor = response.data;
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
                alert('Recensione inviata con successo!');
                this.showReviewForm = false;
                 // Reset del form dopo l'invio
                this.reviewForm = {
                    name_reviewer: '',
                    email_reviewer: '',
                    stars: 0,
                    review_text: '',
                    doctor_id: ''
                };

            } catch (error) {
                console.error('Errore:', error);
            }
        },
        async sendMessage() {
            this.contactForm.doctor_id = this.doctor.id;
            try {
                await axios.post(`${this.base_url}/api/messages`, this.contactForm);
                alert('Messaggio inviato con successo!');
                this.showContactForm = false;
                // Reset del form dopo l'invio
                this.contactForm = {
                  name: '',
                  email: '',
                  message: '',
                  doctor_id: ''
                };
            } catch (error) {
                console.error('Errore:', error);
            }
        }
    }
};
</script>

<template>
    <div class="doctor-detail container text-light p-4">
        <div v-if="loading" class="text-center">
            <p class="loading-message">Caricamento...</p>
        </div>
        <div v-else-if="error" class="text-center text-danger">
            <p>Errore: {{ error }}</p>
        </div>
        <div v-else class="doctor-card bg-dark p-4 rounded shadow">
            <h1 class="doctor-name display-4 text-info">{{ doctor.surname }}</h1>
            <div class="doctor-info d-flex align-items-center my-4">
                <img v-if="doctor.pic" :src="`${base_url}/storage/images/${doctor.pic}`" alt="Immagine del dottore"
                    class="img-fluid me-2 rounded-circle" style="width: 200px;" @error="handleImageError" />
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
                <button class="btn btn-secondary" @click="showReviewForm = !showReviewForm">Lascia una Recensione</button>
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
                            <textarea id="message" v-model="contactForm.message" rows="4" class="form-control" required></textarea>
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
                            <input type="text" id="name" v-model="reviewForm.name_reviewer" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" id="email" v-model="reviewForm.email_reviewer" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="rating" class="form-label">Voto</label>
                            <div class="star-rating">
                                <span v-for="n in 5" :key="n" :class="{'filled-star': n <= reviewForm.stars}" 
                                      @click="setRating(n)">&#9733;</span>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="review" class="form-label">Recensione</label>
                            <textarea id="review" v-model="reviewForm.review_text" class="form-control" rows="4" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Invia Recensione</button>
                    </form>
                </div>
            </div>
        </div>
        <router-link class="back-home btn btn-outline-light mt-3" to="/">Torna alla home</router-link>
    </div>
</template>

<style scoped>
.doctor-detail {
    max-width: 900px;
    margin: 0 auto;
}

.review-container, .contact-container {
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