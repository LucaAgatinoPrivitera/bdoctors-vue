<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TheWelcome from './components/TheWelcome.vue';
import HelloWorld from './components/HelloWorld.vue'
import DoctorList from './components/DoctorList.vue';

</script>

<template>
  <div id="app">
    <!-- Header, Navbar, o altri componenti comuni possono andare qui -->
    <header>
      <div class="container-fluid m-0 py-2">
        <nav class="container d-flex justify-space-around w-100">
          <div class="w-100">
            <h1 class="m-0 p-0 text-light"><router-link class="text-decoration-none text-light " to="/">BDoctors</router-link></h1>
          </div>
          <div class="w-100 d-flex align-items-center justify-content-end">
            <p class="ms-3 mb-0 pb-0"><router-link class="text-decoration-none text-light "
                to="/login">Accedi</router-link></p>
            <p class="ms-3 mb-0 pb-0"><router-link class="text-decoration-none text-light "
                to="/register">Registrati</router-link></p>
            <p class="ms-3 mb-0 pb-0"><router-link class="text-decoration-none text-light " to="/">Home</router-link>
            </p>
            <!-- <p class="ms-3 mb-0 pb-0"><router-link class="text-decoration-none text-light "
              to="/about">About</router-link></p> -->
            <p class="ms-3 mb-0 pb-0"><router-link class="text-decoration-none text-light "
                to="/doctors">Doctors</router-link></p>
            <!-- <p class="ms-3 mb-0 pb0"><router-link class="text-decoration-none text-light "
              to="/contact">Contact</router-link></p> -->
          </div>

        </nav>
      </div>

    </header>

    <!-- Questo è il punto in cui verranno visualizzati i componenti delle rotte -->
    <router-view></router-view>

    <!-- Footer o altri componenti comuni possono andare qui -->
  </div>
</template>

<style scoped></style>
