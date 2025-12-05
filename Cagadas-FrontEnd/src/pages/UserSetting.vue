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
            type="text"
            v-model="nombre"
            placeholder="Tu nombre"
            required
          />
        </div>

        <!-- Apellidos -->
        <div class="input-group">
          <label>Apellidos</label>
          <input
            type="text"
            v-model="apellidos"
            placeholder="Tus apellidos"
            required
          />
        </div>

        <!-- Correo -->
        <div class="input-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            v-model="correo"
            placeholder="tu@email.com"
            required
          />
        </div>

        <!-- Contraseña actual -->
        <div class="input-group">
          <label>Contraseña actual</label>
          <div class="password-wrapper">
            <input
              :type="mostrarPasswordActual ? 'text' : 'password'"
              v-model="passwordActual"
              placeholder="Tu contraseña actual"
            />
            <button
              type="button"
              class="toggle-password"
              @click="mostrarPasswordActual = !mostrarPasswordActual"
              :aria-label="
                mostrarPasswordActual
                  ? 'Ocultar contraseña'
                  : 'Mostrar contraseña'
              "
            >
              <svg
                v-if="mostrarPasswordActual"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <!-- Ojo abierto -->
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <!-- Ojo cerrado con línea -->
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                ></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Nueva contraseña -->
        <div class="input-group">
          <label>Nueva contraseña (opcional)</label>
          <div class="password-wrapper">
            <input
              :type="mostrarPasswordNueva ? 'text' : 'password'"
              v-model="passwordNueva"
              placeholder="Dejar en blanco para no cambiar"
            />
            <button
              type="button"
              class="toggle-password"
              @click="mostrarPasswordNueva = !mostrarPasswordNueva"
              :aria-label="
                mostrarPasswordNueva
                  ? 'Ocultar contraseña'
                  : 'Mostrar contraseña'
              "
            >
              <svg
                v-if="mostrarPasswordNueva"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <!-- Ojo abierto -->
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <!-- Ojo cerrado con línea -->
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                ></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
          <p class="hint">
            Deja este campo vacío si no deseas cambiar tu contraseña
          </p>
        </div>

        <!-- Botón guardar -->
        <button type="submit" class="save-button">Guardar cambios</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Datos del usuario
const nombre = ref("");
const apellidos = ref("");
const correo = ref("");
const passwordActual = ref("");
const passwordNueva = ref("");
const user = JSON.parse(localStorage.getItem("user"));

// Estados de visibilidad de contraseñas
const mostrarPasswordActual = ref(false);
const mostrarPasswordNueva = ref(false);

// Función para guardar cambios
const guardarCambios = () => {
  console.log("Guardando cambios...");
  console.log("Nombre:", nombre.value);
  console.log("Apellidos:", apellidos.value);
  console.log("Correo:", correo.value);
  console.log("Password actual:", passwordActual.value);
  console.log("Password nueva:", passwordNueva.value);

  // Aquí iría la lógica para enviar los datos al backend
  alert("Cambios guardados correctamente");
};
</script>

<style scoped>
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
}

.input-group input:focus {
  border-color: #a67b5b;
  box-shadow: 0 0 4px rgba(166, 123, 91, 0.4);
}

/* Wrapper para contraseña con icono */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 45px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #8b5e3c;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.toggle-password:hover {
  color: #a67b5b;
  background: rgba(166, 123, 91, 0.1);
}

.toggle-password:active {
  transform: scale(0.95);
}

/* Hint text */
.hint {
  font-size: 0.8rem;
  color: #8b5e3c;
  margin-top: 6px;
  margin-bottom: 0;
  font-style: italic;
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

  .save-button {
    font-size: 1rem;
    padding: 12px;
  }
}
</style>
