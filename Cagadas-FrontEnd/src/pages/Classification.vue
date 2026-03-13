<template>
  <div class="classification-container">
    <header class="header">
      <h1 class="title">🏆 Clasificación</h1>
      <router-link to="/home" class="back-link">← Volver al inicio</router-link>
    </header>

    <!-- Clasificación por puntos (victorias semanales del año) -->
    <section class="section">
      <h2 class="section-title">Puntos por victorias semanales</h2>
      <p class="section-desc">
        Caga mas que el resto y consigue un punto, en caso de quedar empatado, cada uno consigue medio punto.
      </p>
      <div class="ranking-card">
        <ul v-if="displayedPoints.length > 0" class="ranking-list">
          <li
            v-for="(item, index) in displayedPoints"
            :key="item.user._id"
            class="ranking-item"
            :class="{
              'ranking-item--gold': index === 0,
              'ranking-item--silver': index === 1,
              'ranking-item--bronze': index === 2,
            }"
          >
            <span class="position">
              <span v-if="index === 0" class="medal" aria-hidden="true">🥇</span>
              <span v-else-if="index === 1" class="medal" aria-hidden="true">🥈</span>
              <span v-else-if="index === 2" class="medal" aria-hidden="true">🥉</span>
              <span v-else>{{ positionLabel(index + 1) }}</span>
            </span>
            <span class="name">{{ item.user.firstName }} {{ item.user.lastName }}</span>
            <span class="value">{{ item.points }} {{ item.points === 1 ? 'punto' : 'puntos' }}</span>
          </li>
        </ul>
        <p v-else class="empty-message">Aún no hay datos para la clasificación por puntos.</p>
        <button
          v-if="showMoreVisible"
          type="button"
          class="show-more-btn"
          @click="showMore"
        >
          {{ pointsLimit === 5 ? 'Mostrar más' : 'Mostrar menos' }}-
        </button>
      </div>
    </section>

    <!-- Cagadas registradas en un año -->
    <section class="section">
      <h2 class="section-title">Cagadas registradas en un año</h2>
      <p class="section-desc">
        Número de veces que ha cagado cada persona en el año actual.
      </p>
      <div class="table-card">
        <div v-if="yearStats.length > 0" class="table-wrapper">
          <table class="poops-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nº de cagadas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stat in yearStats" :key="stat.user._id">
                <td>{{ stat.user?.firstName }} {{ stat.user?.lastName }}</td>
                <td>{{ stat.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="empty-message">No hay cagadas registradas este año.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getYearAllPoops, getClassificationPoints } from "../services/PoopServices";

const classificationPoints = ref([]);
const yearStats = ref([]);
const pointsLimit = ref(5);

const displayedPoints = computed(() => {
  return classificationPoints.value.slice(0, pointsLimit.value);
});

const showMoreVisible = computed(() => classificationPoints.value.length > 5);

function positionLabel(position) {
  const ordinals = ["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º", "9º", "10º"];
  return ordinals[position - 1] || `${position}º`;
}

function showMore() {
  pointsLimit.value = pointsLimit.value === 5 ? 10 : 5;
}

async function loadData() {
  try {
    const [pointsRes, yearRes] = await Promise.all([
      getClassificationPoints(),
      getYearAllPoops(),
    ]);
    classificationPoints.value = pointsRes.data?.classification ?? [];
    yearStats.value = yearRes.data?.stats ?? [];
  } catch (err) {
    console.error("Error loading classification data:", err);
  }
}

onMounted(loadData);
</script>

<style scoped>
.classification-container {
  min-height: 100vh;
  background: #f5e9dd;
  padding: 20px;
  padding-bottom: 40px;
}

.header {
  margin-bottom: 24px;
}

.title {
  font-size: 1.8rem;
  color: #8b5e3c;
  margin: 0 0 12px 0;
  font-weight: bold;
}

.back-link {
  color: #8b5e3c;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
}

.back-link:hover {
  text-decoration: underline;
}

.section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 1.25rem;
  color: #5a4331;
  margin-bottom: 6px;
  font-weight: bold;
}

.section-desc {
  font-size: 0.9rem;
  color: #5a4331;
  margin-bottom: 12px;
  opacity: 0.9;
}

.ranking-card,
.table-card {
  background: #fffdfb;
  padding: 20px;
  border-radius: 16px;
  box-shadow: rgba(60, 40, 20, 0.15) 0px 4px 12px;
  border: 1px solid #e6d5c3;
}

.ranking-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e6d5c3;
  font-size: 1rem;
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-item--gold {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.4) 0%, rgba(255, 223, 128, 0.25) 100%);
  border-radius: 10px;
  margin: 2px -12px;
  padding-left: 12px;
  padding-right: 12px;
}

.ranking-item--silver {
  background: linear-gradient(90deg, rgba(192, 192, 192, 0.45) 0%, rgba(230, 230, 230, 0.3) 100%);
  border-radius: 10px;
  margin: 2px -12px;
  padding-left: 12px;
  padding-right: 12px;
}

.ranking-item--bronze {
  background: linear-gradient(90deg, rgba(205, 127, 50, 0.45) 0%, rgba(210, 180, 140, 0.3) 100%);
  border-radius: 10px;
  margin: 2px -12px;
  padding-left: 12px;
  padding-right: 12px;
}

.position {
  min-width: 40px;
  font-weight: bold;
  color: #5a4331;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
}

.position .medal {
  font-size: 1.4rem;
  line-height: 1;
}

.ranking-item--gold .position { color: #b8860b; }
.ranking-item--silver .position { color: #6b6b6b; }
.ranking-item--bronze .position { color: #8b4513; }

.name {
  flex: 1;
  color: #5a4331;
  font-weight: 500;
}

.value {
  color: #8b5e3c;
  font-weight: 600;
}

.show-more-btn {
  display: block;
  width: 100%;
  margin-top: 16px;
  padding: 10px 16px;
  background: #e6d5c3;
  color: #5a4331;
  border: 1px solid #c8b29a;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.show-more-btn:hover {
  background: #d4a574;
  color: #fffdfb;
  transform: translateY(-1px);
}

.table-wrapper {
  overflow-x: auto;
}

.poops-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.poops-table th,
.poops-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e6d5c3;
}

.poops-table th {
  background: #fffdfb;
  color: #5a4331;
  font-weight: 600;
}

.poops-table tbody tr:hover {
  background: #faf5f0;
}

.empty-message {
  text-align: center;
  color: #5a4331;
  padding: 20px;
  margin: 0;
}
</style>
