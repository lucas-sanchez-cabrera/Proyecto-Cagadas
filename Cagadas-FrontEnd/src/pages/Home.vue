<template>
  <div class="home-container">
    <!-- Header con botón principal -->
    <div class="header">
      <CacaIcon :size="30" />
      <h1 class="title">Cagadas {{ user.firstName }}</h1>
    </div>

    <!-- Botón principal "He Cagado" -->
    <button class="main-button" @click="registrarCagada">💩 +1</button>

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

    <!-- Link a configuración -->
    <router-link to="/user-setting" class="settings-link">
      ⚙️ Configuración
    </router-link>
    <button @click="logOut" class="logout-button">
      <LogOutIcon :size="20" />
      <span>Cerrar Sesión</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
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

// Registrar componentes de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
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
    const stats = response.data.stats;
    const history = response.data.history;
    console.log("Week stats:", stats);
    console.log("Week history:", history);

    if (stats && stats.length > 0) {
      // Poblar gráfica circular
      weeklyPieData.value.labels = stats.map(
        (stat) => `${stat.user.firstName}`
      );
      weeklyPieData.value.datasets[0].data = stats.map((stat) => stat.count);
      weeklyPieData.value.datasets[0].backgroundColor = stats.map(
        (_, index) => colors[index % colors.length]
      );

      // Poblar gráfica de barras (Un dataset por usuario para poder filtrar en la leyenda)
      weeklyBarData.value.labels = ["Total Semanal"]; // Una sola etiqueta en el eje X
      weeklyBarData.value.datasets = stats.map((stat, index) => ({
        label: `${stat.user.firstName}`,
        data: [stat.count],
        backgroundColor: colors[index % colors.length],
        borderColor: "#8c6647",
        borderWidth: 1,
        borderRadius: 8,
      }));
    }
  } catch (error) {
    console.error("Error loading week data:", error);
  }
};

// Cargar datos del mes
const loadMonthData = async () => {
  try {
    const response = await getMonthAllPoops();
    const stats = response.data.stats;
    const history = response.data.history;

    console.log("Month stats:", stats);
    console.log("Month history:", history);

    if (stats && stats.length > 0) {
      // Poblar gráfica circular
      monthlyPieData.value.labels = stats.map(
        (stat) => `${stat.user.firstName}`
      );
      monthlyPieData.value.datasets[0].data = stats.map((stat) => stat.count);
      monthlyPieData.value.datasets[0].backgroundColor = stats.map(
        (_, index) => colors[index % colors.length]
      );

      // Poblar gráfica de barras (Un dataset por usuario)
      monthlyBarData.value.labels = ["Total Mensual"];
      monthlyBarData.value.datasets = stats.map((stat, index) => ({
        label: `${stat.user.firstName}`,
        data: [stat.count],
        backgroundColor: colors[index % colors.length],
        borderColor: "#8c6647",
        borderWidth: 1,
        borderRadius: 8,
      }));
    }
  } catch (error) {
    console.error("Error loading month data:", error);
  }
};

// Cargar datos del año
const loadYearData = async () => {
  try {
    const response = await getYearAllPoops();
    const stats = response.data.stats;
    const history = response.data.history;

    console.log("Year stats:", stats);
    console.log("Year history:", history);

    if (stats && stats.length > 0) {
      // Poblar gráfica circular (Total por usuario)
      yearlyPieData.value.labels = stats.map(
        (stat) => `${stat.user.firstName}`
      );
      yearlyPieData.value.datasets[0].data = stats.map((stat) => stat.count);
      yearlyPieData.value.datasets[0].backgroundColor = stats.map(
        (_, index) => colors[index % colors.length]
      );

      // Poblar gráfica de barras (Desglose por meses y por usuario)
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

      // Crear un dataset por cada usuario
      const datasets = stats.map((stat, index) => {
        // Inicializar array de 12 meses en 0
        const monthlyCounts = new Array(12).fill(0);

        // Filtrar el historial para este usuario y contar por mes
        const userPoops = history.filter(
          (poop) => poop.user._id === stat.user._id
        );
        userPoops.forEach((poop) => {
          const date = new Date(poop.date);
          const monthIndex = date.getMonth();
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

      yearlyBarData.value.labels = months;
      yearlyBarData.value.datasets = datasets;
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
  try {
    await createPoop(user._id);
    alert("¡Te marcaste un perfect! 💩");
    window.location.reload();
  } catch (error) {
    console.error(error);
    alert("Las has cagado, algo salió mal 😅");
  }
};

// Cargar datos al montar el componente
onMounted(async () => {
  await loadWeekData();
  await loadMonthData();
  await loadYearData();
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f5e9dd;
  padding: 20px;
  padding-bottom: 40px;
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

/* Link de configuración */
.settings-link {
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
</style>
