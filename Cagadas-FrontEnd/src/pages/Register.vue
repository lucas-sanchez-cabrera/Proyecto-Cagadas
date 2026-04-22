<template>
  <div class="login-container">
    <div class="login-card">
      <CacaIcon size="50" />
      <h2 class="title">Registrarse</h2>

      <p class="info-text">
        Introduce tus datos para crear una cuenta.
      </p>

      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label>Nombre</label>
          <input
            type="text"
            v-model="firstName"
            placeholder="Introduce tu nombre"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="input-group">
          <label>Apellidos</label>
          <input
            type="text"
            v-model="lastName"
            placeholder="Introduce tus apellidos"
            required
            :disabled="isLoading"
          />
        </div>

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

        <div class="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            v-model="password"
            placeholder="Introduce tu contraseña"
            required
            minlength="6"
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
import { useRouter } from "vue-router";
import CacaIcon from "../icons/CacaIcon.vue";
import { register } from "../services/UserServices";

const router = useRouter();
// Estado local del formulario de registro
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const isLoading = ref(false);

// Flujo de registro: crear usuario y volver al login
const handleRegister = async () => {
  isLoading.value = true;

  try {
    const user = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    };

    console.log("Registrando usuario:", user);
    const response = await register(user);

    console.log("Registro exitoso:", response.data);
    alert("¡Registro exitoso! Ya puedes iniciar sesión.");

    // Redirigir al login después del registro exitoso
    router.push("/login");
  } catch (error) {
    console.error("Error en el registro:", error);

    if (error.response) {
      // El servidor respondió con un error
      alert(
        `Error: ${
          error.response.data.message || "No se pudo completar el registro"
        }`
      );
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      alert("Error: No se pudo conectar con el servidor");
    } else {
      // Algo pasó al configurar la petición
      alert("Error: " + error.message);
    }
  } finally {
    isLoading.value = false;
  }
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
  width: 100%;
  text-align: center;
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

/* Escala mayor para pantallas de escritorio */
@media (min-width: 1024px) {
  .login-container {
    padding: 48px;
  }

  .login-card {
    max-width: 580px;
    padding: 42px;
    border-radius: 22px;
  }

  .title {
    font-size: 2.2rem;
  }
}
</style>
