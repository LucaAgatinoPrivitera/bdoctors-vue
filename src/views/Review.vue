<template>
    <div class="container">
        <h1>Lascia una Recensione</h1>
        <form @submit.prevent="submitReview">
            <div class="form-group">
                <label for="name">Nome</label>
                <input type="text" id="name" v-model="form.name" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="rating">Voto</label>
                <select id="rating" v-model="form.rating" class="form-control" required>
                    <option value="">Seleziona un voto</option>
                    <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="review">Recensione</label>
                <textarea id="review" v-model="form.review" class="form-control" required></textarea>
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
                name: '',
                rating: '',
                review: ''
            }
        };
    },
    methods: {
        async submitReview() {
            try {
                await axios.post(`/api/doctors/${this.$route.params.doctorId}/reviews`, this.form);
                alert('Recensione inviata con successo!');
                this.$router.push('/');
            } catch (error) {
                console.error('Errore nell\'invio della recensione:', error);
                alert('Errore nell\'invio della recensione.');
            }
        }
    }
};
</script>
