<template>
  <div class="settings-container">
    <!-- Header -->
    <div class="header">
      <router-link to="/home" class="back-button">← Volver</router-link>
      <h1 class="title">Configuración de Usuario</h1>
    </div>

    <!-- Formulario de configuración -->
    <div class="settings-card">
      <form @submit.prevent="guardarCambios">
        <!-- Nombre -->
        <div class="input-group">
          <label>Nombre</label>
          <input
            ref="inputNombre"
            type="text"
            placeholder="Tu nombre"
            required
            dir="ltr"
            autocomplete="name"
          />
        </div>

        <!-- Apellidos -->
        <div class="input-group">
          <label>Apellidos</label>
          <input
            ref="inputApellidos"
            type="text"
            placeholder="Tus apellidos"
            required
            dir="ltr"
            autocomplete="family-name"
          />
        </div>

        <!-- Correo -->
        <div class="input-group">
          <label>Correo electrónico</label>
          <input
            ref="inputCorreo"
            type="email"
            placeholder="tu@email.com"
            required
            dir="ltr"
            autocomplete="email"
          />
        </div>

        <!-- Botón nueva contraseña -->
        <div class="input-group">
          <router-link to="/change-password" class="change-password-button">
            Nueva contraseña
          </router-link>
        </div>

        <!-- Botón guardar -->
        <button type="submit" class="save-button" :disabled="isLoading">
          {{ isLoading ? "Guardando..." : "Guardar cambios" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { updateUser } from "../services/UserServices";

// Datos del usuario
const user = JSON.parse(localStorage.getItem("user"));
// Refs directos a inputs (modo no-controlado para evitar problemas de escritura)
const inputNombre = ref(null);
const inputApellidos = ref(null);
const inputCorreo = ref(null);
const isLoading = ref(false);

// Valores iniciales: el navegador controla el input (no Vue), así no se escribe al revés
onMounted(() => {
  if (inputNombre.value) inputNombre.value.value = user?.firstName ?? "";
  if (inputApellidos.value) inputApellidos.value.value = user?.lastName ?? "";
  if (inputCorreo.value) inputCorreo.value.value = user?.email ?? "";
});

// Función para guardar cambios
const guardarCambios = async () => {
  if (!user?._id) {
    alert("No se ha encontrado la sesión. Inicia sesión de nuevo.");
    return;
  }

  const firstName = inputNombre.value?.value?.trim() ?? "";
  const lastName = inputApellidos.value?.value?.trim() ?? "";
  const email = inputCorreo.value?.value?.trim().toLowerCase() ?? "";

  isLoading.value = true;

  try {
    // Envia solo los campos editables del perfil
    const response = await updateUser(user._id, {
      firstName,
      lastName,
      email,
    });

    const updatedUser = { ...user, ...response.data.user };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Cambios guardados correctamente");
  } catch (err) {
    const msg = err.response?.data?.message || "No se pudieron guardar los cambios.";
    alert(`Error: ${msg}`);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Pantalla de ajustes de perfil */
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

/* Card de configuración */
.settings-card {
  background: #fffdfb;
  padding: 24px;
  border-radius: 16px;
  box-shadow: rgba(60, 40, 20, 0.15) 0px 4px 12px;
  border: 1px solid #e6d5c3;
}

/* Grupos de input */
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
  direction: ltr;
}

.input-group input:focus {
  border-color: #a67b5b;
  box-shadow: 0 0 4px rgba(166, 123, 91, 0.4);
}

/* Botón nueva contraseña */
.change-password-button {
  display: block;
  width: 100%;
  padding: 14px;
  background: #faf5f0;
  color: #8b5e3c;
  border: 2px solid #a67b5b;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  box-sizing: border-box;
}

.change-password-button:hover {
  background: #a67b5b;
  color: white;
  transform: translateY(-2px);
}

/* Botón guardar */
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

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(166, 123, 91, 0.4);
}

.save-button:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 360px) {
  .settings-container {
    padding: 16px;
  }

  .title {
    font-size: 1.5rem;
  }

  .settings-card {
    padding: 20px;
  }

  .save-button,
  .change-password-button {
    font-size: 1rem;
    padding: 12px;
  }
}

@media (min-width: 768px) {
  /* En escritorio: layout centrado en columna */
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

  .settings-card form {
    display: flex;
    flex-direction: column;
  }

  .input-group {
    margin-bottom: 22px;
  }

  .save-button {
    margin-top: 14px;
  }
}
</style>
