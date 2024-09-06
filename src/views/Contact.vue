<template>
    <div class="container">
        <h1>Invia un Messaggio</h1>
        <form @submit.prevent="submitMessage">
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
                message: '',
                doctor_id: '', // Associa l'ID del dottore dal route params
            }
        };
    },
    methods: {
        async submitMessage() {
            // Associa l'ID del dottore dal route params
            this.form.doctor_id = this.$route.params.doctorId;
            console.log(this.form); // Verifica i dati inviati
            try {
                await axios.post(`http://localhost:8000/api/messages`, this.form);
                alert('Messaggio inviato con successo!');
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
