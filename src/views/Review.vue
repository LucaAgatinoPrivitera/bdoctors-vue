<template>
    <div class="container">
        <h1>Lascia una Recensione</h1>
        <form @submit.prevent="submitReview">
            <div class="form-group">
                <label for="name">Nome</label>
                <input type="text" id="name" v-model="form.name_reviewer" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="rating">Voto</label>
                <select id="rating" v-model="form.stars" class="form-control" required>
                    <option value="">Seleziona un voto</option>
                    <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="review">Recensione</label>
                <textarea id="review" v-model="form.review_text" class="form-control" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Invia</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            form: {
                name_reviewer: '',
                stars: '',
                review_text: '',
                doctor_id: '', // Inizializza anche il doctor_id
            }
        };
    },
    methods: {
        async submitReview() {
            // Associa l'ID del dottore dal route params
            this.form.doctor_id = this.$route.params.doctorId;
            console.log(this.form); // Verifica i dati inviati
            try {
                await axios.post(`http://localhost:8000/api/reviews`, this.form);
                alert('Recensione inviata con successo!');
                this.$router.push('/');
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
    }
};
</script>
