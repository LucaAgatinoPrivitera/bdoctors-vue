<template>
  <div id="app">
    <!-- Header, Navbar, o altri componenti comuni possono andare qui -->
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <h1 class="m-0 p-0 text-light"><router-link class="text-decoration-none text-light " to="/">BDoctors</router-link></h1>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <router-link class="nav-link text-light" to="/login">Accedi</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-light" to="/register">Registrati</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-light" to="/">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-light" to="/doctors">Dottori</router-link>
              </li>
              <!-- Aggiungi altre voci se necessario -->
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <!-- Questo è il punto in cui verranno visualizzati i componenti delle rotte -->
    <router-view></router-view>

    <!-- Footer o altri componenti comuni possono andare qui -->
  </div>
</template>

<style scoped>
/* Eventuali stili personalizzati */
</style>
