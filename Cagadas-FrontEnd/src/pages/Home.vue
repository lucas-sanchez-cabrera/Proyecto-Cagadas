<template>
  <div class="home-container">
    <div class="home-content">
      <!-- Header con botón principal -->
      <div class="header">
        <CacaIcon :size="30" />
        <h1 class="title">Cagadas {{ user.firstName }}</h1>
      </div>

      <!-- Botón principal "He Cagado" (con cooldown 10 min) -->
      <button
        class="main-button"
        :class="{ 'main-button--cooldown': cooldownRemaining > 0 }"
        :disabled="cooldownRemaining > 0"
        @click="registrarCagada"
      >
        <template v-if="cooldownRemaining > 0">
          ⏱️ Espera {{ cooldownText }}
        </template>
        <template v-else> 💩 +1 </template>
      </button>

      <!-- Sección de gráficas semanales -->
      <div class="section">
        <h2 class="section-title">Esta Semana</h2>

        <!-- Gráfica de barras comparativa -->
        <div class="chart-card">
          <h3 class="chart-title">Comparación semanal</h3>
          <Bar
            v-if="weeklyBarData.labels.length > 0"
            :data="weeklyBarData"
            :options="barChartOptions"
          />
          <p v-else style="text-align: center; color: #5a4331; padding: 20px">
            No hay datos para esta semana
          </p>
        </div>

        <!-- Gráfica circular de la semana -->
        <div class="chart-card">
          <h3 class="chart-title">Total semanal por usuario</h3>
          <Pie
            v-if="weeklyPieData.labels.length > 0"
            :data="weeklyPieData"
            :options="pieChartOptions"
          />
          <p v-else style="text-align: center; color: #5a4331; padding: 20px">
            No hay datos para esta semana
          </p>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ totalSemana }}</div>
            <div class="stat-label">Total de la semana</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ promedioDiario }}</div>
            <div class="stat-label">Promedio diario</div>
          </div>
        </div>
      </div>

      <!-- Sección de datos mensuales -->
      <div class="section">
        <h2 class="section-title">Este Mes</h2>

        <!-- Gráfica de barras mensual -->
        <div class="chart-card">
          <h3 class="chart-title">Comparación mensual</h3>
          <Bar
            v-if="monthlyBarData.labels.length > 0"
            :data="monthlyBarData"
            :options="barChartOptions"
          />
          <p v-else style="text-align: center; color: #5a4331; padding: 20px">
            No hay datos para este mes
          </p>
        </div>

        <!-- Gráfica circular del mes -->
        <div class="chart-card">
          <h3 class="chart-title">Total mensual por usuario</h3>
          <Pie
            v-if="monthlyPieData.labels.length > 0"
            :data="monthlyPieData"
            :options="pieChartOptions"
          />
          <p v-else style="text-align: center; color: #5a4331; padding: 20px">
            No hay datos para este mes
          </p>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ totalMes }}</div>
            <div class="stat-label">Total del mes</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ promedioSemanal }}</div>
            <div class="stat-label">Promedio semanal</div>
          </div>
        </div>
      </div>

      <!-- Sección de datos anuales -->
      <div class="section">
        <h2 class="section-title">Este Año</h2>

        <!-- Gráfica de barras anual -->
        <div class="chart-card">
          <h3 class="chart-title">Comparación anual</h3>
          <Bar
            v-if="yearlyBarData.labels.length > 0"
            :data="yearlyBarData"
            :options="barChartOptions"
          />
          <p v-else style="text-align: center; color: #5a4331; padding: 20px">
            No hay datos para este año
          </p>
        </div>

        <!-- Gráfica circular del año -->
        <div class="chart-card">
          <h3 class="chart-title">Total anual por usuario</h3>
          <Pie
            v-if="yearlyPieData.labels.length > 0"
            :data="yearlyPieData"
            :options="pieChartOptions"
          />
          <p v-else style="text-align: center; color: #5a4331; padding: 20px">
            No hay datos para este año
          </p>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ totalAnio }}</div>
            <div class="stat-label">Total del año</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ promedioMensual }}</div>
            <div class="stat-label">Promedio mensual</div>
          </div>
        </div>
      </div>

      <div class="actions-row">
        <!-- Link a clasificación -->
        <router-link to="/classification" class="classification-link">
          🏆 Clasificación
        </router-link>
        <!-- Link a configuración -->
        <router-link to="/user-setting" class="settings-link">
          ⚙️ Configuración
        </router-link>
        <button @click="logOut" class="logout-button">
          <LogOutIcon :size="20" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Bar, Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import CacaIcon from "../icons/CacaIcon.vue";
import LogOutIcon from "../icons/LogOutIcon.vue";
import {
  createPoop,
  getWeekAllPoops,
  getMonthAllPoops,
  getYearAllPoops,
} from "../services/PoopServices";

const user = JSON.parse(localStorage.getItem("user"));

const COOLDOWN_STORAGE_KEY = `poopCooldown_${user?._id}`;
const COOLDOWN_MINUTES = 10;

// Cooldown: timestamp (ms) hasta cuando no puede registrar de nuevo
const cooldownEndsAt = ref(null);
const cooldownRemaining = ref(0); // segundos restantes (se actualiza con timer)

const cooldownText = computed(() => {
  const s = cooldownRemaining.value;
  if (s <= 0) return "";
  const min = Math.floor(s / 60);
  const sec = s % 60;
  if (min > 0) return `${min} min ${sec} s`;
  return `${sec} s`;
});

let cooldownTimer = null;

function updateCooldownRemaining() {
  if (!cooldownEndsAt.value) {
    cooldownRemaining.value = 0;
    return;
  }
  const remaining = Math.ceil((cooldownEndsAt.value - Date.now()) / 1000);
  if (remaining <= 0) {
    cooldownEndsAt.value = null;
    cooldownRemaining.value = 0;
    try {
      localStorage.removeItem(COOLDOWN_STORAGE_KEY);
    } catch (_) {}
    if (cooldownTimer) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
    }
  } else {
    cooldownRemaining.value = remaining;
  }
}

function setCooldown(isoDateOrMs) {
  const end =
    typeof isoDateOrMs === "string"
      ? new Date(isoDateOrMs).getTime()
      : isoDateOrMs;
  if (end <= Date.now()) return;
  cooldownEndsAt.value = end;
  cooldownRemaining.value = Math.ceil((end - Date.now()) / 1000);
  try {
    localStorage.setItem(COOLDOWN_STORAGE_KEY, String(end));
  } catch (_) {}
  if (!cooldownTimer) {
    cooldownTimer = setInterval(updateCooldownRemaining, 1000);
  }
}

// Registrar componentes de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
);

// Colores para las gráficas
const colors = [
  "#a67b5b",
  "#c8b29a",
  "#e6d5c3",
  "#d4a574",
  "#b89968",
  "#9d7e5c",
];

// Datos para gráfica de barras semanal
const weeklyBarData = ref({
  labels: [],
  datasets: [],
});

// Datos para gráfica circular de la semana (total por usuario)
const weeklyPieData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [],
      borderColor: "#fffdfb",
      borderWidth: 3,
    },
  ],
});

// Datos para gráfica circular del mes (total por usuario)
const monthlyPieData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [],
      borderColor: "#fffdfb",
      borderWidth: 3,
    },
  ],
});

// Datos para gráfica de barras mensual
const monthlyBarData = ref({
  labels: [],
  datasets: [],
});

// Datos para gráfica circular del año (total por usuario)
const yearlyPieData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [],
      borderColor: "#fffdfb",
      borderWidth: 3,
    },
  ],
});

// Datos para gráfica de barras anual
const yearlyBarData = ref({
  labels: [],
  datasets: [],
});

// Opciones para gráficas de barras
const barChartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "#5a4331",
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
    tooltip: {
      backgroundColor: "#5a4331",
      titleColor: "#fffdfb",
      bodyColor: "#fffdfb",
      borderColor: "#a67b5b",
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "#5a4331",
        font: {
          size: 11,
        },
      },
      grid: {
        color: "#e6d5c3",
      },
    },
    x: {
      ticks: {
        color: "#5a4331",
        font: {
          size: 11,
        },
      },
      grid: {
        display: false,
      },
    },
  },
});

// Opciones para gráfica circular
const pieChartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#5a4331",
        font: {
          size: 11,
          weight: "bold",
        },
        padding: 10,
      },
    },
    tooltip: {
      backgroundColor: "#5a4331",
      titleColor: "#fffdfb",
      bodyColor: "#fffdfb",
      borderColor: "#a67b5b",
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
    },
  },
});

// Estadísticas calculadas
const totalSemana = computed(() => {
  if (!weeklyPieData.value.datasets[0]?.data) return 0;
  return weeklyPieData.value.datasets[0].data.reduce((a, b) => a + b, 0);
});

const promedioDiario = computed(() => {
  const total = totalSemana.value;
  return Math.round((total / 7) * 10) / 10; // Un decimal
});

const totalMes = computed(() => {
  if (!monthlyPieData.value.datasets[0]?.data) return 0;
  return monthlyPieData.value.datasets[0].data.reduce((a, b) => a + b, 0);
});

const promedioSemanal = computed(() => {
  const total = totalMes.value;
  const semanas = 4; // Aproximadamente 4 semanas por mes
  return Math.round(total / semanas);
});

const totalAnio = computed(() => {
  if (!yearlyPieData.value.datasets[0]?.data) return 0;
  return yearlyPieData.value.datasets[0].data.reduce((a, b) => a + b, 0);
});

const promedioMensual = computed(() => {
  const total = totalAnio.value;
  const meses = 12;
  return Math.round(total / meses);
});

// Cargar datos de la semana
const loadWeekData = async () => {
  try {
    const response = await getWeekAllPoops();
    const stats = response.data.stats ?? [];
    const history = response.data.history ?? [];

    if (stats.length > 0) {
      weeklyPieData.value = {
        labels: stats.map((stat) => `${stat.user.firstName}`),
        datasets: [
          {
            data: stats.map((stat) => stat.count),
            backgroundColor: stats.map((_, i) => colors[i % colors.length]),
            borderColor: "#fffdfb",
            borderWidth: 3,
          },
        ],
      };
      weeklyBarData.value = {
        labels: ["Total Semanal"],
        datasets: stats.map((stat, index) => ({
          label: `${stat.user.firstName}`,
          data: [stat.count],
          backgroundColor: colors[index % colors.length],
          borderColor: "#8c6647",
          borderWidth: 1,
          borderRadius: 8,
        })),
      };
    } else {
      weeklyPieData.value = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderColor: "#fffdfb",
            borderWidth: 3,
          },
        ],
      };
      weeklyBarData.value = { labels: [], datasets: [] };
    }
  } catch (error) {
    console.error("Error loading week data:", error);
  }
};

// Cargar datos del mes
const loadMonthData = async () => {
  try {
    const response = await getMonthAllPoops();
    const stats = response.data.stats ?? [];
    const history = response.data.history ?? [];

    if (stats.length > 0) {
      monthlyPieData.value = {
        labels: stats.map((stat) => `${stat.user.firstName}`),
        datasets: [
          {
            data: stats.map((stat) => stat.count),
            backgroundColor: stats.map((_, i) => colors[i % colors.length]),
            borderColor: "#fffdfb",
            borderWidth: 3,
          },
        ],
      };
      monthlyBarData.value = {
        labels: ["Total Mensual"],
        datasets: stats.map((stat, index) => ({
          label: `${stat.user.firstName}`,
          data: [stat.count],
          backgroundColor: colors[index % colors.length],
          borderColor: "#8c6647",
          borderWidth: 1,
          borderRadius: 8,
        })),
      };
    } else {
      monthlyPieData.value = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderColor: "#fffdfb",
            borderWidth: 3,
          },
        ],
      };
      monthlyBarData.value = { labels: [], datasets: [] };
    }
  } catch (error) {
    console.error("Error loading month data:", error);
  }
};

// Cargar datos del año
const loadYearData = async () => {
  try {
    const response = await getYearAllPoops();
    const stats = response.data.stats ?? [];
    const history = response.data.history ?? [];

    if (stats.length > 0) {
      const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      const datasets = stats.map((stat, index) => {
        const monthlyCounts = new Array(12).fill(0);
        const userPoops = history.filter(
          (poop) => poop.user._id === stat.user._id,
        );
        userPoops.forEach((poop) => {
          const monthIndex = new Date(poop.date).getMonth();
          monthlyCounts[monthIndex]++;
        });
        return {
          label: `${stat.user.firstName} ${stat.user.lastName}`,
          data: monthlyCounts,
          backgroundColor: colors[index % colors.length],
          borderColor: "#8c6647",
          borderWidth: 1,
          borderRadius: 4,
        };
      });

      yearlyPieData.value = {
        labels: stats.map((stat) => `${stat.user.firstName}`),
        datasets: [
          {
            data: stats.map((stat) => stat.count),
            backgroundColor: stats.map((_, i) => colors[i % colors.length]),
            borderColor: "#fffdfb",
            borderWidth: 3,
          },
        ],
      };
      yearlyBarData.value = { labels: months, datasets };
    } else {
      yearlyPieData.value = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderColor: "#fffdfb",
            borderWidth: 3,
          },
        ],
      };
      yearlyBarData.value = { labels: [], datasets: [] };
    }
  } catch (error) {
    console.error("Error loading year data:", error);
  }
};

const logOut = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// Función para registrar nueva cagada
const registrarCagada = async () => {
  if (cooldownRemaining.value > 0) return;
  try {
    const response = await createPoop(user._id);
    const endsAt = response?.data?.cooldownEndsAt;
    if (endsAt) setCooldown(endsAt);
    alert("¡Te marcaste un perfect! 💩");
    await loadWeekData();
    await loadMonthData();
    await loadYearData();
  } catch (error) {
    console.error(error);
    const data = error.response?.data;
    if (error.response?.status === 429 && data?.cooldownEndsAt) {
      setCooldown(data.cooldownEndsAt);
      alert(data.message || "Debes esperar 10 minutos entre cagadas.");
    } else {
      alert("Las has cagado, algo salió mal 😅");
    }
  }
};

// Cargar datos al montar el componente e iniciar cooldown si hay uno guardado
onMounted(async () => {
  try {
    const stored = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (stored) {
      const end = parseInt(stored, 10);
      if (end > Date.now()) setCooldown(end);
      else updateCooldownRemaining();
    }
  } catch (_) {}
  await loadWeekData();
  await loadMonthData();
  await loadYearData();
});

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f5e9dd;
  padding: 20px;
  padding-bottom: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.home-content {
  width: min(1320px, 100%);
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.title {
  font-size: 1.8rem;
  color: #8b5e3c;
  margin: 0;
  font-weight: bold;
}

/* Botón principal */
.main-button {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #a67b5b 0%, #8c6647 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(166, 123, 91, 0.3);
  margin-bottom: 10px;
}

.main-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(166, 123, 91, 0.4);
}

.main-button:active {
  transform: translateY(0);
}

.main-button:disabled,
.main-button--cooldown {
  opacity: 0.85;
  cursor: not-allowed;
  transform: none;
}

.main-button:disabled:hover,
.main-button--cooldown:hover {
  transform: none;
  box-shadow: 0 4px 12px rgba(166, 123, 91, 0.3);
}

/* Secciones */
.section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.4rem;
  color: #5a4331;
  margin-bottom: 16px;
  font-weight: bold;
}

/* Tarjetas de gráficas */
.chart-card {
  background: #fffdfb;
  padding: 20px;
  border-radius: 16px;
  box-shadow: rgba(60, 40, 20, 0.15) 0px 4px 12px;
  border: 1px solid #e6d5c3;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 1.1rem;
  color: #5a4331;
  margin-bottom: 16px;
  font-weight: 600;
  text-align: center;
}

/* Grid de estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.stat-card {
  background: #fffdfb;
  padding: 16px;
  border-radius: 12px;
  box-shadow: rgba(60, 40, 20, 0.15) 0px 4px 12px;
  border: 1px solid #e6d5c3;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #a67b5b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: #5a4331;
  font-weight: 500;
}

/* Link de clasificación */
.classification-link {
  display: block;
  text-align: center;
  padding: 14px;
  background: #fffdfb;
  color: #5a4331;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  border: 1px solid #e6d5c3;
  transition: all 0.3s ease;
  margin-top: 24px;
}

.classification-link:hover {
  background: #faf5f0;
  transform: translateY(-1px);
  box-shadow: rgba(60, 40, 20, 0.1) 0px 4px 8px;
}

/* Link de configuración */
.settings-link {
  display: block;
  text-align: center;
  padding: 14px;
  background: #fffdfb;
  color: #5a4331;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 601;
  border: 1px solid #e6d5c3;
  transition: all 0.3s ease;
  margin-top: 12px;
}

.settings-link:hover {
  background: #faf5f0;
  transform: translateY(-1px);
  box-shadow: rgba(60, 40, 20, 0.1) 0px 4px 8px;
}

/* Responsive para pantallas muy pequeñas */
@media (max-width: 360px) {
  .home-container {
    padding: 16px;
  }

  .title {
    font-size: 1.5rem;
  }

  .main-button {
    font-size: 1.1rem;
    padding: 16px;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .chart-card {
    padding: 16px;
  }

  .stat-value {
    font-size: 1.6rem;
  }
}

/* Botón de cerrar sesión */
.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: #fffdfb;
  color: #d32f2f; /* Rojo suave para indicar acción destructiva/salida */
  border: 1px solid #e6d5c3;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 12px;
}

.logout-button:hover {
  background: #ffebee;
  border-color: #ef9a9a;
  transform: translateY(-1px);
  box-shadow: rgba(211, 47, 47, 0.1) 0px 4px 8px;
}

.logout-button:active {
  transform: translateY(0);
}

.actions-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

/* Layout escritorio: estructura principal centrada y compacta */
@media (min-width: 768px) {
  .home-container {
    padding: 20px 20px 32px;
  }

  .home-content {
    width: min(1120px, 100%);
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 12px;
    align-items: start;
  }

  .header {
    grid-column: 1 / -1;
    justify-content: center;
    margin-bottom: 12px;
    width: 100%;
  }

  .title {
    font-size: 2rem;
  }

  .main-button {
    grid-column: 1 / -1;
    width: min(320px, 100%);
    padding: 14px;
    font-size: 1.1rem;
    margin-bottom: 14px;
    margin-left: auto;
    margin-right: auto;
  }

  .section {
    grid-column: 1 / -1;
    display: grid;
    /* Dos graficas por fila en desktop */
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
    width: 100%;
  }

  .section-title {
    grid-column: 1 / -1;
    font-size: 1.35rem;
    margin-bottom: 0;
  }

  .chart-card {
    padding: 14px;
    margin-bottom: 0;
    min-height: 250px;
  }

  .chart-title {
    font-size: 1rem;
    margin-bottom: 10px;
  }

  .classification-link,
  .settings-link,
  .logout-button {
    margin: 0;
  }

  .classification-link {
    margin-top: 0;
  }

  .classification-link,
  .settings-link,
  .logout-button {
    padding: 8px 10px;
    font-size: 0.88rem;
    min-height: 36px;
    line-height: 1.2;
    box-sizing: border-box;
  }

  .classification-link,
  .settings-link {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .actions-row {
    display: grid;
    margin-top: 20px;
    grid-column: 1 / -1;
    /* Fila de acciones: clasificacion, configuracion y logout */
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    align-items: stretch;
  }

  .logout-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0;
    gap: 6px;
  }

  .logout-button :deep(svg) {
    width: 14px;
    height: 14px;
  }

  .stats-grid {
    grid-column: 1 / -1;
    /* Totales/promedios centrados debajo de las graficas */
    grid-template-columns: repeat(2, minmax(190px, 1fr));
    width: min(520px, 100%);
    max-width: 520px;
    gap: 10px;
    margin-top: 0;
    margin-left: auto;
    margin-right: auto;
    justify-self: center;
  }

  .stat-card {
    padding: 10px;
  }

  .stat-value {
    font-size: 1.5rem;
    margin-bottom: 2px;
  }

  .stat-label {
    font-size: 0.78rem;
  }

  :deep(canvas) {
    max-height: 185px !important;
  }
}

@media (min-width: 1024px) {
  /* En pantallas grandes, las stats se alinean al ancho de la seccion */
  .stats-grid {
    width: 100%;
    max-width: none;
    margin-left: 0;
    margin-right: 0;
    justify-self: stretch;
  }

  .stat-card {
    width: min(260px, 100%);
    justify-self: center;
  }
}
</style>
