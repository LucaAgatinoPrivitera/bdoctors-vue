<template>
    <div>
      <select v-model="selectedSpecialization">
        <option v-for="specialization in specializations" :value="specialization.id">{{ specialization.name }}</option>
      </select>
      <button @click="searchDoctors">Cerca</button>
  
      <ul>
        <li v-for="doctor in doctors" :key="doctor.id">{{ doctor.name }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        specializations: [],
        selectedSpecialization: null,
        doctors: []
      };
    },
    created() {
      this.fetchSpecializations();
    },
    methods: {
      fetchSpecializations() {
        fetch('/api/specializations')
          .then(response => response.json())
          .then(data => {
            this.specializations = data;
          });
      },
      searchDoctors() {
        fetch(`/api/doctors/specialization/${this.selectedSpecialization}`)
          .then(response => response.json())
          .then(data => {
            this.doctors = data;
          });
      }
    }
  };
  </script>
  