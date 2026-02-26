<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="toolbar-custom">
        <ion-title class="toolbar-title">ARM WORKOUT</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="workout-content">
      <!-- Background decoration -->
      <div class="bg-circles">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
      </div>

      <!-- Rep Counter -->
      <div class="counter-section">
        <p class="counter-label">REPS</p>
        <div class="counter-display" :class="{ pulse: isPulsing }">
          <span class="counter-number">{{ state?.repDisplay ?? 0 }}</span>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-row">
        <div class="stat-card">
          <ion-icon :icon="trophyOutline" class="stat-icon gold" />
          <p class="stat-value">{{ state?.stats.score ?? 0 }}</p>
          <p class="stat-label">คะแนน</p>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-card">
          <ion-icon :icon="flashOutline" class="stat-icon orange" />
          <p class="stat-value status-text">{{ state?.stats.lastMessage ?? '—' }}</p>
          <p class="stat-label">สถานะ</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="button-group">
        <button class="btn btn-start" @click="start" :disabled="isRunning">
          <ion-icon :icon="playCircleOutline" />
          <span>START</span>
        </button>
        <button class="btn btn-stop" @click="stop" :disabled="!isRunning">
          <ion-icon :icon="stopCircleOutline" />
          <span>STOP</span>
        </button>
      </div>

      <!-- Status Indicator -->
      <div class="status-bar" :class="isRunning ? 'active' : 'idle'">
        <span class="status-dot"></span>
        <span class="status-text-bar">{{ isRunning ? 'กำลังบันทึก...' : 'พร้อมใช้งาน' }}</span>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border footer-custom">
      <p class="footer-text">663380227-5 ภควรรธ บุญเรือง</p>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonIcon } from "@ionic/vue";
import { trophyOutline, flashOutline, playCircleOutline, stopCircleOutline } from "ionicons/icons";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

const state = ref<WorkoutState | null>(null);
const isRunning = ref(false);
const isPulsing = ref(false);

const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();

onMounted(() => {
  engine.onChange((s) => {
    state.value = s;
  });
});

// Pulse animation on rep change
watch(
  () => state.value?.repDisplay,
  () => {
    isPulsing.value = true;
    setTimeout(() => (isPulsing.value = false), 300);
  }
);

async function start() {
  if (isRunning.value) return;
  isRunning.value = true;
  await tts.speak("เริ่มกายบริหารแขน ยกขึ้นจนสุดแล้วลดลง");
  engine.start();
  await motion.start((s) => engine.process(s));
}

async function stop() {
  if (!isRunning.value) return;
  await motion.stop();
  engine.stop();
  isRunning.value = false;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');

/* ─── Variables ─── */
:root {
  --bg: #0d0f14;
  --surface: #161b24;
  --surface2: #1e2535;
  --accent: #f97316;
  --accent2: #facc15;
  --text: #f0f4ff;
  --muted: #6b7a99;
  --green: #22c55e;
}

/* ─── Base ─── */
ion-page, .workout-content {
  --background: #0d0f14;
  font-family: 'DM Sans', sans-serif;
}

/* ─── Toolbar ─── */
.toolbar-custom {
  --background: #0d0f14;
  --border-color: transparent;
  padding: 8px 0;
}
.toolbar-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.6rem;
  letter-spacing: 0.15em;
  color: #f0f4ff;
}

/* ─── Background Circles ─── */
.bg-circles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.06;
}
.circle-1 {
  width: 420px; height: 420px;
  background: radial-gradient(circle, #f97316, transparent 70%);
  top: -120px; right: -120px;
}
.circle-2 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #6366f1, transparent 70%);
  bottom: 40px; left: -80px;
}

/* ─── Content Layout ─── */
.workout-content {
  position: relative;
}
.workout-content > * {
  position: relative;
  z-index: 1;
}

/* ─── Counter ─── */
.counter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px 32px;
}
.counter-label {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 0.9rem;
  letter-spacing: 0.3em;
  color: #f97316;
  margin: 0 0 8px;
}
.counter-display {
  width: 200px; height: 200px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #161b24;
  border: 3px solid #1e2535;
  box-shadow: 0 0 0 8px #1e253566, 0 20px 60px #00000080;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.counter-display.pulse {
  transform: scale(1.06);
  box-shadow: 0 0 0 8px #f97316aa, 0 20px 60px #f9731630;
}
.counter-number {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 6rem;
  color: #f0f4ff;
  line-height: 1;
}

/* ─── Stats ─── */
.stats-row {
  display: flex;
  align-items: center;
  margin: 0 24px 32px;
  background: #161b24;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #1e2535;
}
.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat-icon {
  font-size: 1.6rem;
  margin-bottom: 4px;
}
.stat-icon.gold { color: #facc15; }
.stat-icon.orange { color: #f97316; }
.stat-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  color: #f0f4ff;
  margin: 0;
  line-height: 1;
}
.status-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem !important;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.stat-label {
  font-size: 0.7rem;
  color: #6b7a99;
  margin: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.stat-divider {
  width: 1px;
  height: 60px;
  background: #1e2535;
  margin: 0 16px;
}

/* ─── Buttons ─── */
.button-group {
  display: flex;
  gap: 12px;
  margin: 0 24px 20px;
}
.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: none;
  border-radius: 16px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.2s ease, box-shadow 0.2s ease;
}
.btn ion-icon { font-size: 1.4rem; }
.btn:active { transform: scale(0.96); }
.btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

.btn-start {
  background: linear-gradient(135deg, #f97316, #fb923c);
  color: #fff;
  box-shadow: 0 8px 24px #f9731640;
}
.btn-start:not(:disabled):hover {
  box-shadow: 0 12px 32px #f9731660;
}
.btn-stop {
  background: #1e2535;
  color: #f0f4ff;
  border: 1px solid #2d3748;
}
.btn-stop:not(:disabled):hover {
  background: #2d3748;
}

/* ─── Status Bar ─── */
.status-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 24px;
  padding: 10px 16px;
  border-radius: 12px;
  background: #161b24;
  border: 1px solid #1e2535;
}
.status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-bar.idle .status-dot { background: #6b7a99; }
.status-bar.active .status-dot {
  background: #22c55e;
  animation: blink 1s ease-in-out infinite;
}
.status-text-bar {
  font-size: 0.8rem;
  color: #6b7a99;
  letter-spacing: 0.05em;
}
.status-bar.active .status-text-bar { color: #22c55e; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ─── Footer ─── */
.footer-custom {
  --background: #0d0f14;
  padding-bottom: env(safe-area-inset-bottom);
}
.footer-text {
  text-align: center;
  font-size: 0.75rem;
  color: #6b7a99;
  letter-spacing: 0.05em;
  padding: 12px 0;
  margin: 0;
  border-top: 1px solid #1e2535;
}
</style>