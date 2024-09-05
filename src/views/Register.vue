<script>
  import * as yup from "yup";
  
  export default {
    data() {
      return {
        username: "",
        email: "",
        password: "",
        errors: {},
      };
    },
    methods: {
      async validateField(field) {
        const schema = this.getValidationSchema();
        try {
          await schema.validateAt(field, this.$data);
          this.errors[field] = "";
        } catch (error) {
          this.errors[field] = error.message;
        }
      },
      async handleSubmit() {
        const schema = this.getValidationSchema();
        try {
          await schema.validate(this.$data, { abortEarly: false });
          // Esegui la logica di registrazione (chiamata API, ecc.)
          alert("Registrazione completata con successo!");
        } catch (error) {
          // Gestisci gli errori
          if (error.inner) {
            error.inner.forEach((err) => {
              this.errors[err.path] = err.message;
            });
          }
        }
      },
      getValidationSchema() {
        return yup.object().shape({
          username: yup.string().required("Il nome utente è obbligatorio"),
          email: yup
            .string()
            .email("L'email non è valida")
            .required("L'email è obbligatoria"),
          password: yup
            .string()
            .min(6, "La password deve contenere almeno 6 caratteri")
            .required("La password è obbligatoria"),
        });
      },
    },
  };
  </script>

<template>
    <div class="register-form">
      <h2>Registrazione</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            @blur="validateField('username')"
          />
          <span class="error" v-if="errors.username">{{ errors.username }}</span>
        </div>
  
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            @blur="validateField('email')"
          />
          <span class="error" v-if="errors.email">{{ errors.email }}</span>
        </div>
  
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            @blur="validateField('password')"
          />
          <span class="error" v-if="errors.password">{{ errors.password }}</span>
        </div>
  
        <button type="submit">Registrati</button>
      </form>
    </div>
  </template>
  
  <style scoped>
  .error {
    color: red;
    font-size: 0.9em;
  }
  .form-group {
    margin-bottom: 15px;
  }
  button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
  }
  button:hover {
    background-color: #45a049;
  }
  </style>
  