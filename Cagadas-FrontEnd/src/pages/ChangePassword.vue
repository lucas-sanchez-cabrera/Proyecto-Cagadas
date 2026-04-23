<template>
  <div class="settings-container">
    <div class="header">
      <router-link to="/user-setting" class="back-button">← Volver</router-link>
      <h1 class="title">Cambiar contraseña</h1>
    </div>

    <div class="settings-card">
      <p class="info-text">
        Introduce tu contraseña actual y la nueva contraseña que quieres usar.
      </p>

      <form @submit.prevent="cambiarContraseña">
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <div class="input-group">
          <label>Contraseña actual</label>
          <input
            v-model="contraseñaActual"
            type="password"
            placeholder="Tu contraseña actual"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="input-group">
          <label>Nueva contraseña</label>
          <input
            v-model="contraseñaNueva"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
            :disabled="isLoading"
          />
        </div>

        <div class="input-group">
          <label>Repetir nueva contraseña</label>
          <input
            v-model="contraseñaRepetida"
            type="password"
            placeholder="Repite la nueva contraseña"
            required
            :disabled="isLoading"
          />
        </div>

        <button type="submit" class="save-button" :disabled="isLoading">
          {{ isLoading ? "Guardando..." : "Cambiar contraseña" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login, updateUser } from "../services/UserServices";

const router = useRouter();
const user = JSON.parse(localStorage.getItem("user"));

// Estado del formulario de cambio de contraseña
const contraseñaActual = ref("");
const contraseñaNueva = ref("");
const contraseñaRepetida = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

// Flujo: validar datos, verificar contraseña actual y guardar la nueva
const cambiarContraseña = async () => {
  errorMessage.value = "";

  if (contraseñaNueva.value !== contraseñaRepetida.value) {
    errorMessage.value = "La nueva contraseña y la repetición no coinciden.";
    return;
  }

  if (contraseñaNueva.value.length < 6) {
    errorMessage.value = "La nueva contraseña debe tener al menos 6 caracteres.";
    return;
  }

  if (!user?._id || !user?.email) {
    errorMessage.value = "No se ha encontrado la sesión. Inicia sesión de nuevo.";
    return;
  }

  isLoading.value = true;

  try {
    // Reautenticacion: evita cambiar contraseña con sesion desactualizada
    await login({ email: user.email, password: contraseñaActual.value });
  } catch (err) {
    isLoading.value = false;
    errorMessage.value =
      err.response?.data?.message || "Contraseña actual incorrecta.";
    return;
  }

  try {
    // Actualiza solo el campo password del usuario actual
    await updateUser(user._id, { password: contraseñaNueva.value });
    alert("Contraseña cambiada correctamente.");
    router.push("/user-setting");
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "No se pudo cambiar la contraseña.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Pantalla para actualizar credenciales del usuario */
.settings-container {
  min-height: 100vh;
  background: #f5e9dd;
  padding: 20px;
  padding-bottom: 40px;
}

.header {
  margin-bottom: 24px;
}

.back-button {
  display: inline-block;
  color: #5a4331;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.back-button:hover {
  color: #8b5e3c;
  transform: translateX(-2px);
}

.title {
  font-size: 1.8rem;
  color: #8b5e3c;
  margin: 0;
  font-weight: bold;
}

.settings-card {
  background: #fffdfb;
  padding: 24px;
  border-radius: 16px;
  box-shadow: rgba(60, 40, 20, 0.15) 0px 4px 12px;
  border: 1px solid #e6d5c3;
}

.info-text {
  color: #5a4331;
  margin-bottom: 20px;
  line-height: 1.5;
}

.error-message {
  background: #fde8e8;
  color: #c53030;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #5a4331;
  margin-bottom: 6px;
}

.input-group input {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid #c8b29a;
  border-radius: 10px;
  background: #faf5f0;
  color: #3e2a1f;
  outline: none;
  transition: 0.25s;
  font-size: 16px;
}

.input-group input:focus {
  border-color: #a67b5b;
  box-shadow: 0 0 4px rgba(166, 123, 91, 0.4);
}

.save-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #a67b5b 0%, #8c6647 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(166, 123, 91, 0.3);
  margin-top: 8px;
}

.save-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(166, 123, 91, 0.4);
}

.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  /* Layout de escritorio: columna centrada y ancho completo */
  .settings-container {
    width: 100%;
    max-width: none;
    margin: 0 auto;
    padding: 48px 32px 72px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .header {
    width: min(640px, 100%);
    margin-bottom: 22px;
  }

  .title {
    font-size: 2rem;
    line-height: 1.2;
    margin-top: 4px;
  }

  .settings-card {
    width: min(640px, 100%);
    padding: 34px;
    border-radius: 20px;
  }

  .info-text {
    font-size: 1rem;
    margin-bottom: 24px;
  }

  .input-group {
    margin-bottom: 22px;
  }

  .save-button {
    margin-top: 14px;
  }
}
</style>
