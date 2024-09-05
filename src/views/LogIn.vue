<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            :class="{ 'is-invalid': errors.email }"
          />
          <span v-if="errors.email" class="text-danger">{{ errors.email }}</span>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            :class="{ 'is-invalid': errors.password }"
          />
          <span v-if="errors.password" class="text-danger">{{ errors.password }}</span>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import * as yup from 'yup';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const errors = ref({});
  
      // Define a validation schema using Yup
      const schema = yup.object({
        email: yup.string().email('Inserisci un\'email valida').required('L\'email è richiesta'),
        password: yup.string().min(6, 'La password deve avere almeno 6 caratteri').required('La password è richiesta'),
      });
  
      const validate = async () => {
        try {
          await schema.validate({ email: email.value, password: password.value }, { abortEarly: false });
          errors.value = {};
          return true;
        } catch (err) {
          errors.value = err.inner.reduce((acc, current) => {
            acc[current.path] = current.message;
            return acc;
          }, {});
          return false;
        }
      };
  
      const handleSubmit = async () => {
        if (await validate()) {
          // Placeholder for actual login logic
          alert('Login effettuato con successo!');
        }
      };
  
      return {
        email,
        password,
        errors,
        handleSubmit,
      };
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .is-invalid {
    border-color: red;
  }
  
  .text-danger {
    color: red;
    font-size: 0.875em;
  }
  </style>
  