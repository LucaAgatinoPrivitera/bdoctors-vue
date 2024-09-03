<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import TheWelcome from './components/TheWelcome.vue';
import HelloWorld from './components/HelloWorld.vue'
import DoctorList from './components/DoctorList.vue';
</script>

<template>
  <div id="app">
    <!-- Header, Navbar, o altri componenti comuni possono andare qui -->
    <header>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/doctors">Doctors</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>
      </nav>
    </header>

    <!-- Questo è il punto in cui verranno visualizzati i componenti delle rotte -->
    <router-view></router-view>

    <!-- Footer o altri componenti comuni possono andare qui -->
  </div>
</template>

<style scoped></style>
