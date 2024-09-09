<template>
  <div class="contact-container">
    <div class="contact-content">
      <div class="position-relative">
        <h1>Contatta il Medico</h1>
        <button class="btn btn-secondary position-absolute top-0" @click="goBackToDoctor"><i
            class="fa-solid fa-arrow-left"></i></button>
      </div>

      <div v-if="successMessage" class="alert alert-success" role="alert">
        {{ successMessage }}
      </div>

      <form @submit.prevent="sendMessage" class="contact-form">
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
        doctor_id: '', // Inizializza anche il doctor_id
      },
      successMessage: '', // Variabile per il messaggio di successo
    };
  },
  methods: {
    goBackToDoctor() {
      // Naviga alla vista del medico utilizzando lo slug memorizzato
      this.$router.push({ name: 'doctorDetail', params: { slug: this.doctorSlug } });
    },
    async sendMessage() {
      this.form.doctor_id = this.$route.params.doctorId;
      try {
        await axios.post(`http://localhost:8000/api/messages`, this.form);
        this.successMessage = 'Recensione inviata con successo!';

        // Reindirizza alla pagina del dottore dopo 3 secondi
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
    // Secondo me va bene così, se dicono qualcosa passiamo anche il dottore e mettiamo il cognome
    document.title = 'Manda un messaggio';
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

.alert-success {
  margin-top: 20px;
  font-size: 1.2rem;
  padding: 10px;
  border-radius: 4px;
}
</style>
