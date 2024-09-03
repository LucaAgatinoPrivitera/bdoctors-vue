<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import TheWelcome from './components/TheWelcome.vue';
import HelloWorld from './components/HelloWorld.vue'
import DoctorList from './components/DoctorList.vue';
</script>

<template>
  <header>
    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div> -->
  </header>

  <body>
    <DoctorList></DoctorList>
  </body>

  <!-- è stato installato con vue, poi lo usiamo -->
  <!-- <RouterView /> -->

</template>

<style scoped>
</style>
