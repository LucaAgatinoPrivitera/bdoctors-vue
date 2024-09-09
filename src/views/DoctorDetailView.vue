<script>
import axios from 'axios';

export default {
    props: ['id'],
    data() {
        return {
            doctor: null,
            loading: true,
            error: null,
            base_url: 'http://127.0.0.1:8000'
        };
    },
    async created() {
        await this.fetchDoctor();
    },
    methods: {
        async fetchDoctor() {
            const slug = this.$route.params.slug;
            console.log('Slug ricevuto:', slug); // Aggiungi questo log
            try {
                const response = await axios.get(`${this.base_url}/api/doctors/${slug}`);
                this.doctor = response.data;
            } catch (error) {
                console.error('Errore:', error);
                this.error = 'Errore nel recupero dei dati.';
            } finally {
                this.loading = false;
            }
        }
    },
    // il watch non appena vede che il valore cambia, fa eseguire il codice
    watch: {
        doctor(newDoctor) {
            if (newDoctor && newDoctor.surname) {
                document.title = newDoctor.surname;
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
                     class="doctor-img rounded-circle me-4">
                <div>
                    <p><strong>Indirizzo:</strong> {{ doctor.address }}</p>
                    <p><strong>Telefono:</strong> {{ doctor.phone }}</p>
                    <p><strong>Bio:</strong> {{ doctor.bio }}</p>
                </div>
            </div>
            <h3 class="specializations-title text-info">Specializzazioni:</h3>
            <ul class="specializations-list list-unstyled">
                <li v-for="specialization in doctor.specializations" :key="specialization.id" class="specialization-item">
                    {{ specialization.name }}
                </li>
            </ul>
            <div class="actions mt-4">
                <router-link :to="{ name: 'contact', params: { doctorId: doctor.id, slug: doctor.slug } }" class="btn btn-primary me-2">
                    Contatta
                </router-link>
                <router-link :to="{ name: 'review', params: { doctorId: doctor.id } }" class="btn btn-secondary">
                    Lascia una recensione
                </router-link>
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