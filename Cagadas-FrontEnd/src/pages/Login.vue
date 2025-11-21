<template>
  <div class="login-container">
    <div class="login-card">
        <CacaIcon size="50" />
        <h2 class="title">Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label>Nombre de usuario</label>
          <input
            type="text"
            v-model="username"
            placeholder="Nombre de usuario"
            required
          />
        </div>

        <div class="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            v-model="password"
            placeholder="Contraseña"
            required
          />
        </div>

        <button class="login-button" type="submit">Entrar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CacaIcon from "../icons/CacaIcon.vue";

const username = ref("");
const password = ref("");

const login = () => {
  console.log("Usuario:", username.value);
  console.log("Contraseña:", password.value);
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 20px;
  background: #f5e9dd; /* tono beige suave */
}

.title-container {
  display: flex;
  align-items: center;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: #fffdfb; /* blanco cálido */
  padding: 30px;
  border-radius: 18px;
  animation: fadeIn 0.6s ease-in-out;
  box-shadow: rgba(60, 40, 20, 0.25) 0px 4px 12px;
  border: 1px solid #e6d5c3;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 1.8rem;
  color: #8b5e3c; /* marrón medio */
}


/* Inputs */
.input-group {
  margin-bottom: 20px;
}

.input-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #5a4331; /* marrón oscuro */
}

.input-group input {
  width: 100%;
  padding: 12px;
  margin-top: 6px;

  /* separación del borde de la card */
  box-sizing: border-box;

  border: 1px solid #c8b29a;
  border-radius: 10px;
  background: #faf5f0; /* beige claro */
  color: #3e2a1f;

  outline: none;
  transition: 0.25s;
}

.input-group input:focus {
  border-color: #a67b5b; /* marrón suave */
  box-shadow: 0 0 4px rgba(166, 123, 91, 0.4);
}

/* Botón */
.login-button {
  width: 100%;
  padding: 12px;
  background: #a67b5b; /* marrón cálido */
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.login-button:hover {
  background: #8c6647; /* marrón más oscuro */
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
