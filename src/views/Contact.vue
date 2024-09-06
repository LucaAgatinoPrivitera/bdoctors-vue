<template>
    <div class="contact-container">
    <div class="contact-content">
      <h1>Contatta il Medico</h1>
      <form @submit.prevent="submitForm" class="contact-form">
        <div class="form-group">
          <label for="name">Nome</label>
          <input type="text" id="name" v-model="form.name" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>
        <div class="form-group">
          <label for="message">Messaggio</label>
          <textarea id="message" v-model="form.message" rows="4" required></textarea>
        </div>
        <input type="hidden" v-model="form.doctor_id" />
        <button type="submit">Invia Messaggio</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
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
<style scoped>
.contact-container {
  background: url('https://www.sanitysystem.it/imgs/36060_img-articolo-25-luglio-2022-01.jpg') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.contact-content {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.contact-content h1 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 2rem;
  text-align: center;
}

.contact-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-group textarea {
  resize: vertical;
}

button {
  background-color: #007bff;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: #ff0000;
  text-align: center;
  margin-top: 1rem;
}
</style>
