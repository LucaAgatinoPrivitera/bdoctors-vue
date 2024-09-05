<template>
    <div class="container">
        <h1>Contatta il Medico</h1>
        <form @submit.prevent="sendMessage">
            <div class="form-group">
                <label for="name">Nome</label>
                <input type="text" id="name" v-model="form.name" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="form.email" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="message">Messaggio</label>
                <textarea id="message" v-model="form.message" class="form-control" required></textarea>
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
                email: '',
                message: ''
            }
        };
    },
    methods: {
        async sendMessage() {
            try {
                await axios.post(`/api/doctors/${this.$route.params.doctorId}/contact`, this.form);
                alert('Messaggio inviato con successo!');
                this.$router.push('/');
            } catch (error) {
                console.error('Errore nell\'invio del messaggio:', error);
                alert('Errore nell\'invio del messaggio.');
            }
        }
    }
};
</script>
