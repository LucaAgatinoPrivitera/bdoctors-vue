// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api', // Modifica con l'URL del tuo backend
  timeout: 10000, // Timeout in millisecondi
  headers: { 'Content-Type': 'application/json' },
});

export default instance;
