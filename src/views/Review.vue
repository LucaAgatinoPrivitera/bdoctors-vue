<template>
    <div class="review-container">
        <div class="form-wrapper">
            <button class="btn btn-secondary position-absolute " @click="goBackToDoctor"><i class="fa-solid fa-arrow-left"></i></button>
            <h1>Lascia una Recensione</h1>

            <!-- Messaggio di successo -->
            <div v-if="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
            </div>

            <form @submit.prevent="submitReview">
                <div class="form-group">
                    <label for="name">Nome</label>
                    <input type="text" id="name" v-model="form.name_reviewer" class="form-control" placeholder="Inserisci il tuo nome" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="form.email_reviewer" class="form-control" placeholder="Inserisci la tua email" required>
                </div>
                <div class="form-group">
                    <label for="rating">Voto</label>
                    <div class="star-rating">
                        <span v-for="n in 5" :key="n" :class="{'filled-star': n <= form.stars}" @click="setRating(n)">&#9733;</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="review">Recensione</label>
                    <textarea id="review" v-model="form.review_text" class="form-control" placeholder="Scrivi la tua recensione" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Invia</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            form: {
                name_reviewer: '',
                email_reviewer: '',
                stars: 0, // Inizializza a 0 stelle
                review_text: '',
                doctor_id: '', // Inizializza anche il doctor_id
                doctorSlug: this.$route.params.slug
            },
            successMessage: ''
        };
    },
    methods: {
        goBackToDoctor() {
            // Naviga alla vista del medico utilizzando lo slug memorizzato
            this.$router.push({ name: 'doctorDetail', params: { slug: this.doctorSlug } });
        },
        setRating(stars) {
            this.form.stars = stars; // Imposta il voto cliccando sulle stelle
        },
        async submitReview() {
            this.form.doctor_id = this.$route.params.doctorId;
            try {
                await axios.post(`http://localhost:8000/api/reviews`, this.form);
                this.successMessage = 'Recensione inviata con successo!';
                
                // Reindirizza alla pagina del dottore dopo 2 secondi
                setTimeout(() => {
                    const doctorSlug = this.$route.params.slug;
                    this.$router.push(`/doctors/${doctorSlug}`);
                }, 2000);
            } catch (error) {
                if (error.response) {
                    console.error('Errore nella risposta:', error.response.data);
                    alert(`Errore: ${JSON.stringify(error.response.data.errors)}`);
                } else {
                    console.error('Errore:', error);
                    alert('Errore sconosciuto.');
                }
            }
        }
    },
    mounted() {
        document.title = 'Lascia una recensione';
    }
};
</script>

<style scoped>
.review-container {
    background: url('https://img.freepik.com/foto-gratuito/analisi-e-stetoscopio-a-impulsi-medici_23-2148438994.jpg') no-repeat center center fixed;
    background-size: cover;
    height: 94vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-wrapper {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    padding: 20px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    font-size: 1rem;
    margin-bottom: 5px;
    color: #333;
}

input.form-control,
textarea.form-control {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 1rem;
}

textarea.form-control {
    resize: vertical;
    min-height: 150px;
}

.btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    display: block;
    width: 100%;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.alert-success {
    margin-top: 20px;
    font-size: 1.2rem;
    padding: 10px;
    border-radius: 4px;
}

.star-rating {
    font-size: 2rem;
    color: #ddd;
    cursor: pointer;
}

.star-rating .filled-star {
    color: #ffcc00;
}
</style>
