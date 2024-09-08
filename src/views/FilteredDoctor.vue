<template>
    <div>
        <h1>Risultati della Ricerca</h1>
        <div v-if="loading">Caricamento...</div>
        <div v-else-if="error">Errore: {{ error }}</div>
        <div v-else>

            <!-- Visualizza i dettagli del dottore -->
            <div>
                <div class="container">
                    <div class="row text-dark">
                        <div class="col-12 col-md-6 col-lg-4 py-2" v-for="doctor in filteredDoctors" :key="doctor.id">
                            <div class="border p-3 bg-light rounded d-flex flex-column h-100 justify-content-between">
                                <div class="d-flex justify-content-center mb-3">
                                    <img v-if="doctor.pic" :src="`${base_url}/storage/images/${doctor.pic}`"
                                        alt="Immagine del dottore" class="img-fluid" @error="handleImageError" />
                                    <img v-else
                                        src="https://i.pinimg.com/736x/ac/67/4d/ac674d2be5f98abf1c189c75de834155.jpg"
                                        alt="Immagine del dottore" class="img-fluid" />
                                </div>
                                <h2>{{ doctor.surname }}</h2>
                                <p>Indirizzo: {{ doctor.address }}</p>
                                <p>Telefono: {{ doctor.phone }}</p>
                                <p>Bio: {{ doctor.bio }}</p>



                                <h3 v-if="doctor.specializations && doctor.specializations.length > 0">
                                    Specializzazioni:
                                </h3>
                                <ul v-if="doctor.specializations">
                                    <li v-for="specialization in doctor.specializations" :key="specialization.id">
                                        {{ specialization.name }}
                                    </li>
                                </ul>
                                <button class="btn btn-info mt-2" @click="goToDoctorDetail(doctor.slug)">
                                    Visualizza Dettagli
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Altri dettagli del dottore -->
            </div>
        </div>
    </div>
</template>




<script>
import axios from 'axios';

export default {
    data() {
        return {
            filteredDoctors: [],
            loading: true,
            error: null,
            base_url: 'http://127.0.0.1:8000',
            specializations: [],
        };
    },
    async created() {
        await this.fetchDoctors();
        await this.fetchSpecializations();
    },
    methods: {
        async fetchDoctors() {
            const params = this.$route.query; // Usa i parametri della query direttamente
            try {
                const response = await axios.get(`${this.base_url}/api/doctors`, { params });
                console.log(params);

                // Titolo
                if (this.$route.query['specializations[]']) {
                    const specialization = this.$route.query['specializations[]'];
                    document.title = `Ricerca per ${specialization}`;
                }
                else {
                    document.title = `Lista dei dottori`;
                }


                this.filteredDoctors = response.data.data; // Assumi che i dati dei dottori siano in response.data.data
            } catch (error) {
                console.error('Errore:', error);
                this.error = 'Errore nel recupero dei dati.';
            } finally {
                this.loading = false;
            }
        },
        goToDoctorDetail(doctor) {
            console.log(doctor)
            this.$router.push({ name: 'doctorDetail', params: { slug: doctor } });
        },
        async fetchSpecializations() {
            try {
                const response = await axios.get(`${this.base_url}/api/specializations`);
                this.specializations = response.data;
            } catch (error) {
                console.error('Errore:', error);
                this.error = 'Errore nel recupero delle specializzazioni.';
            }
        },
    },
    // mounted() {
    //     document.title = params;
    // }
};
</script>