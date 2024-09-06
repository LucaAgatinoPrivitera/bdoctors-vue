<template>
    <div class="container-fluid m-0 p-0 bg-white">
        <div>
            <h1 class="container text-success">Lista dei Dottori</h1>
        </div>

        <div class="container mb-4 text-dark">
            <h3>
                <button class="btn btn-secondary" @click="toggleSpecializations">
                    {{ showSpecializations ? 'Nascondi specializzazioni' : 'Filtra specializzazioni' }}
                </button>
            </h3>

            <div v-if="showSpecializations">
                <div class="row">
                    <div class="col-md-4 mb-3" v-for="specialization in specializations" :key="specialization.id">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" :id="specialization.id"
                                :value="specialization.name" v-model="selectedSpecializations" />
                            <label class="form-check-label" :for="specialization.id">{{ specialization.name }}</label>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary mt-3" @click="handleSearch">
                    Filtra
                </button>
            </div>
        </div>

        <div class="container" v-if="loading">Caricamento...</div>
        <div class="container" v-else-if="error">Errore: {{ error }}</div>
        <div v-else class="container-fluid bg-white py-4">
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
                            <ul>
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

            <div class="container">
                <button @click="loadPrev" v-if="doctors.current_page > 1" class="btn btn-secondary">
                    Carica precedenti
                </button>
                <button @click="loadMore" v-if="doctors.current_page < doctors.last_page" class="btn btn-secondary">
                    Carica altro
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            doctors: { data: [] },
            filteredDoctors: [],
            specializations: [], // Aggiungi la variabile per le specializzazioni
            selectedSpecializations: [], // Aggiungi la variabile per le specializzazioni selezionate
            loading: true,
            error: null,
            base_url: 'http://127.0.0.1:8000',
            page: 1,
            perPage: 10,
            searchQuery: '',
            showSpecializations: false // Variabile per gestire la visibilità delle specializzazioni
        };
    },
    async created() {
        await this.fetchDoctors();
        await this.fetchSpecializations(); // Carica le specializzazioni quando il componente viene creato
    },
    methods: {
        async fetchDoctors() {
            const params = new URLSearchParams(this.$route.query);
            try {
                const response = await axios.get(`${this.base_url}/api/doctors`, { params });
                console.log('Dati filtrati dei dottori:', response.data); // Aggiungi questo log
                this.filteredDoctors = response.data.data || []; // Assicurati che `data` sia sempre un array
            } catch (error) {
                console.error('Errore:', error);
                this.error = 'Errore nel recupero dei dati.';
            } finally {
                this.loading = false;
            }
        }
        ,
        async fetchSpecializations() {
            try {
                const response = await axios.get(`${this.base_url}/api/specializations`);
                this.specializations = response.data;
            } catch (error) {
                console.error('Errore:', error);
                this.error = 'Errore nel recupero delle specializzazioni.';
            }
        },
        toggleSpecializations() {
            this.showSpecializations = !this.showSpecializations;
        },
        filterDoctorsBySpecialization() {
            if (this.selectedSpecializations.length > 0) {
                this.filteredDoctors = this.doctors.data.filter(doctor =>
                    doctor.specializations.some(specialization =>
                        this.selectedSpecializations.includes(specialization.name)
                    )
                );
            } else {
                this.filteredDoctors = this.doctors.data;
            }
        },
        async loadMore() {
            this.page++;
            await this.fetchDoctors();
        },
        async loadPrev() {
            if (this.page > 1) {
                this.page--;
                await this.fetchDoctors();
            }
        },
        handleSearch() {
            // Costruisci i parametri della query
            const params = new URLSearchParams();
            this.selectedSpecializations.forEach(specialization => {
                params.append('specializations[]', specialization);
            });

            // Reindirizza alla pagina di ricerca con i parametri della query
            this.$router.push({
                name: 'search',
                query: {
                    ...Object.fromEntries(params)
                }
            }).catch(err => {
                console.error('Errore nel reindirizzamento:', err);
            });
        }
        ,
        handleKeypress(event) {
            if (event.key === 'Enter') {
                this.handleSearch();
            }
        },
        goToDoctorDetail(doctor) {
            this.$router.push({ name: 'doctorDetail', params: { slug: doctor.slug } });
        },
        // lo script serve perché ogni utente ha la foto, anche se poi non esiste come file
        handleImageError(event) {
            event.target.src = 'https://i.pinimg.com/736x/ac/67/4d/ac674d2be5f98abf1c189c75de834155.jpg';
        },
    },
    mounted() {
        document.title = 'Lista dei Dottori';
    }
};
</script>

<style scoped>
.img-fluid {
    max-width: 100%;
    height: auto;
}

.btn-secondary {
    margin: 0.5rem;
}
</style>
