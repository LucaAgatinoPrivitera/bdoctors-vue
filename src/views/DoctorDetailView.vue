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
    <div class="container text-light">
        <div v-if="loading">Caricamento...</div>
        <div v-else-if="error">Errore: {{ error }}</div>
        <div v-else>
            <h1>{{ doctor.surname }}</h1>
            <img v-if="doctor.pic" :src="`${base_url}/storage/images/${doctor.pic}`" alt="Immagine del dottore">
            <p>Indirizzo: {{ doctor.address }}</p>
            <p>Telefono: {{ doctor.phone }}</p>
            <p>Bio: {{ doctor.bio }}</p>
            <h3>Specializzazioni:</h3>
            <ul>
                <li v-for="specialization in doctor.specializations" :key="specialization.id">
                    {{ specialization.name }}
                </li>
            </ul>
            <router-link :to="{ name: 'contact', params: { doctorId: doctor.id } }"
                class="btn btn-primary">Contatta</router-link>
            <router-link :to="{ name: 'review', params: { doctorId: doctor.id } }" class="btn btn-primary">Lascia una
                recensione</router-link>
        </div>

        <router-link class="text-decoration-none text-light m-0 py-2 btn btn-primary text-info" to="/">Torna alla
            home</router-link>
    </div>
</template>