<template>
  <div class="login-container">
    <div class="login-card">
      <CacaIcon size="50" />
      <h2 class="title">Registrarse</h2>
      
      <p class="info-text">
        Introduce tu email para solicitar una cuenta. Mandaremos un correo con tu contraseña provicional.
      </p>

      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label>Email</label>
          <input
            type="email"
            v-model="email"
            placeholder="Introduce tu email"
            required
            :disabled="isLoading"
          />
        </div>

        <button class="login-button" type="submit" :disabled="isLoading">
          {{ isLoading ? "Enviando..." : "Enviar" }}
        </button>

        <div class="back-to-login">
          <router-link to="/login">Iniciar Sesión</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CacaIcon from "../icons/CacaIcon.vue";

const email = ref("");
const isLoading = ref(false);

const handleRegister = async () => {
  // Lógica de registro pendiente
  isLoading.value = true;
  console.log("Registrando email:", email.value);

  // Simulación de proceso
  setTimeout(() => {
    isLoading.value = false;
    alert("Solicitud enviada (Simulación)");
  }, 1000);
};
</script>

<style scoped>
/* Reutilizando estilos de Login.vue para consistencia */
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 20px;
  background: #f5e9dd;
  overflow: hidden;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: #fffdfb;
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
  margin-bottom: 15px;
  font-size: 1.8rem;
  color: #8b5e3c;
}

.info-text {
  width: 100%; text-align: center;
  color: #5a4331;
  margin-bottom: 25px;
  font-size: 0.95rem;
  line-height: 1.5;

}

.input-group {
  margin-bottom: 20px;
  width: 100%;
}

.input-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #5a4331;
  margin-bottom: 6px;
}

.input-group input {
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  border: 1px solid #c8b29a;
  border-radius: 12px;
  background: #faf5f0;
  color: #3e2a1f;
  outline: none;
  transition: 0.25s;
  font-size: 1.1rem;
}

.input-group input:focus {
  border-color: #a67b5b;
  box-shadow: 0 0 4px rgba(166, 123, 91, 0.4);
}

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

.login-button:hover:not(:disabled) {
  background: #8c6647;
  transform: translateY(-1px);
}

.login-button:disabled {
  background: #c8b29a;
  cursor: not-allowed;
  opacity: 0.7;
}

.back-to-login {
  margin-top: 15px;
  text-align: center;
  width: 100%;
}

.back-to-login a {
  color: #8b5e3c;
  text-decoration: underline;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.back-to-login a:hover {
  color: #5a4331;
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
