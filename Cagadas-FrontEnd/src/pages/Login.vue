<template>
  <div class="login-container">
    <div class="login-card">
      <CacaIcon size="50" />
      <h2 class="title">Iniciar Sesión</h2>

      <!-- Error message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="login">
        <div class="input-group">
          <label>Email</label>
          <input
            type="text"
            v-model="username"
            placeholder="Email"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            v-model="password"
            placeholder="Contraseña"
            required
            :disabled="isLoading"
          />
        </div>

        <button class="login-button" type="submit" :disabled="isLoading">
          {{ isLoading ? "Cargando..." : "Entrar" }}
        </button>

        <div class="create-account">
          <router-link to="/register">Crear cuenta</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import CacaIcon from "../icons/CacaIcon.vue";
import { login as loginService } from "../services/UserServices.js";

const router = useRouter();

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const login = async () => {
  try {
    errorMessage.value = "";
    isLoading.value = true;

    // Validar campos
    if (!username.value || !password.value) {
      errorMessage.value = "Por favor ingrese usuario y contraseña";
      return;
    }

    // Llamar al servicio de login
    const response = await loginService({
      email: username.value,
      password: password.value,
    });

    console.log("Login exitoso:", response.data);

    // Guardar información del usuario en localStorage
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // Navegar al Home
    router.push("/home");
  } catch (error) {
    console.error("Error en login:", error);

    if (error.response) {
      // El servidor respondió con un error
      errorMessage.value =
        error.response.data.message || "Credenciales inválidas";
    } else if (error.request) {
      // No se recibió respuesta del servidor
      errorMessage.value = "No se pudo conectar con el servidor";
    } else {
      // Otro tipo de error
      errorMessage.value = "Error al iniciar sesión";
    }
  } finally {
    isLoading.value = false;
  }
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
  overflow: hidden; /* evita scroll en login */
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
  font-size: 16px;
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

.login-button:hover:not(:disabled) {
  background: #8c6647; /* marrón más oscuro */
  transform: translateY(-1px);
}

.login-button:disabled {
  background: #c8b29a;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Error message */
.error-message {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
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

.create-account {
  margin-top: 15px;
  text-align: center;
}

.create-account a {
  color: #8b5e3c;
  text-decoration: underline;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.create-account a:hover {
  color: #5a4331;
}
</style>
