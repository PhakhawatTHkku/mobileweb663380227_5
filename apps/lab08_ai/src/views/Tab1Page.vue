<template>
  <ion-page>
    <ion-header class="neon-header">
      <ion-toolbar color="dark">
        <ion-title class="neon-title">🤖 Gemini Vision AI</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="neon-background">
      <input ref="fileEl" type="file" accept="image/*" hidden @change="onFileChange" />

      <!-- Header Section -->
      <div class="header-section">
        <h1 class="main-title">Image Analysis</h1>
        <p class="subtitle">Upload or capture an image to analyze with AI</p>
      </div>

      <!-- Button Group -->
      <div class="button-group">
        <ion-button
          expand="block"
          class="neon-button"
          @click="fileEl?.click()"
        >
          <ion-icon slot="start" name="image"></ion-icon>
          เลือกไฟล์ภาพ
        </ion-button>
        <ion-button
          expand="block"
          class="neon-button secondary"
          @click="onTakePhoto"
        >
          <ion-icon slot="start" name="camera"></ion-icon>
          ถ่ายภาพ
        </ion-button>
      </div>

      <!-- Preview Card -->
      <div v-if="previewUrl" class="preview-card">
        <div class="preview-label">📸 Preview</div>
        <ion-img :src="previewUrl" class="preview-image" />
      </div>

      <!-- Analyze Button -->
      <ion-button
        expand="block"
        class="analyze-button"
        :disabled="!img || loading"
        @click="onAnalyze"
        size="large"
      >
        <ion-spinner v-if="loading" name="crescent"></ion-spinner>
        <span v-else>
          <ion-icon slot="start" name="sparkles"></ion-icon>
          วิเคราะห์ภาพ
        </span>
      </ion-button>

      <!-- Result Card -->
      <div v-if="result" class="result-card">
        <div class="result-header">
          <h2 class="result-title">✨ ผลการวิเคราะห์</h2>
        </div>

        <div class="result-content">
          <div v-if="result.caption" class="result-item">
            <div class="result-label">📝 คำบรรยาย</div>
            <div class="result-value">{{ result.caption }}</div>
          </div>

          <div v-if="result.tags && result.tags.length" class="result-item">
            <div class="result-label">🏷️ Tags</div>
            <div class="tags-container">
              <span v-for="(tag, idx) in result.tags" :key="idx" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <div v-if="result.objects && result.objects.length" class="result-item">
            <div class="result-label">🎯 Objects</div>
            <ul class="objects-list">
              <li v-for="(obj, idx) in result.objects" :key="idx">{{ obj }}</li>
            </ul>
          </div>

          <div v-if="result.safety" class="result-item">
            <div class="result-label">⚠️ Safety</div>
            <div class="safety-badge" :class="{ safe: !result.safety }">
              {{ result.safety || "Safe" }}
            </div>
          </div>
        </div>
      </div>

      <div class="spacer"></div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import { ref } from "vue";
import {
  IonButton, IonContent, IonHeader, IonImg, IonPage, IonSpinner, IonTitle, IonToolbar, IonIcon
} from "@ionic/vue";
import { image, camera, sparkles } from "ionicons/icons";
import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image } from "../core/ai.interface";
import type { ImageAnalysisResult } from "../core/ai.interface";

const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
  result.value = null;
}

async function onTakePhoto() {
  loading.value = true;
  try {
    const b64 = await PhotoService.fromCamera();
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
    result.value = null;
  } finally {
    loading.value = false;
  }
}

async function onAnalyze() {
  if (!img.value) return;
  loading.value = true;
  try {
    result.value = await GeminiVisionService.analyze(img.value);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
:root {
  --neon-red: #ff1744;
  --neon-pink: #ff5983;
  --dark-bg: #0d0d0d;
  --card-bg: #1a1a2e;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  
}

ion-page {
  --background: var(--dark-bg);
}

.neon-background {
  --background: linear-gradient(135deg, #0d0d0d 0%, #1a0a0a 100%);
}

.neon-header {
  --background: var(--dark-bg);
  box-shadow: 0 0 20px rgba(255, 23, 68, 0.3);
}

.neon-title {
  --color: var(--neon-red);
  font-size: 1.4rem;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 23, 68, 0.5);
}

/* Header Section */
.header-section {
  text-align: center;
  padding: 2rem 1rem 1rem;
  margin-bottom: 1rem;
}

.main-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--neon-red), var(--neon-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem;
  text-shadow: 0 0 20px rgba(255, 23, 68, 0.3);
  letter-spacing: 0.5px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
  font-weight: 300;
}

/* Button Group */
.button-group {
  display: flex;
  gap: 1rem;
  padding: 0 1rem 1.5rem;
}

.button-group ion-button {
  flex: 1;
}

.neon-button {
  --background: var(--neon-red);
  --background-activated: var(--neon-pink);
  --border-radius: 12px;
  --padding-top: 0.75rem;
  --padding-bottom: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.85rem;
  box-shadow: 0 0 15px rgba(255, 23, 68, 0.4);
  transition: all 0.3s ease;
}

.neon-button:hover:not(:disabled) {
  box-shadow: 0 0 25px rgba(255, 23, 68, 0.8);
  transform: translateY(-2px);
}

.neon-button.secondary {
  --background: rgba(255, 23, 68, 0.2);
  --color: var(--neon-red);
  border: 2px solid var(--neon-red);
  box-shadow: inset 0 0 10px rgba(255, 23, 68, 0.2);
}

.neon-button.secondary:hover:not(:disabled) {
  --background: rgba(255, 23, 68, 0.3);
  box-shadow: inset 0 0 15px rgba(255, 23, 68, 0.4), 0 0 20px rgba(255, 23, 68, 0.6);
}

/* Preview Card */
.preview-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 1rem;
  margin: 1rem;
  border: 2px solid var(--neon-red);
  box-shadow: 0 0 20px rgba(255, 23, 68, 0.2), inset 0 0 10px rgba(255, 23, 68, 0.05);
  overflow: hidden;
}

.preview-label {
  font-size: 0.9rem;
  color: var(--neon-red);
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.preview-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
}

/* Analyze Button */
.analyze-button {
  --background: var(--neon-red);
  --background-activated: var(--neon-pink);
  --border-radius: 12px;
  margin: 1.5rem 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 0 25px rgba(255, 23, 68, 0.4);
  transition: all 0.3s ease;
}

.analyze-button:not(:disabled):hover {
  box-shadow: 0 0 40px rgba(255, 23, 68, 0.8);
  transform: translateY(-2px);
}

.analyze-button:disabled {
  --background: #444444;
  opacity: 0.6;
  box-shadow: none;
}

/* Result Card */
.result-card {
  background: var(--card-bg);
  border-radius: 16px;
  margin: 1rem;
  border: 2px solid var(--neon-red);
  box-shadow: 0 0 25px rgba(255, 23, 68, 0.2),
              inset 0 0 15px rgba(255, 23, 68, 0.05);
  overflow: hidden;
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.result-header {
  background: linear-gradient(
    135deg,
    rgba(255, 23, 68, 0.15),
    rgba(255, 89, 131, 0.15)
  );
  border-bottom: 2px solid var(--neon-red);
  padding: 1rem;
}

.result-title {
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 12px rgba(255, 23, 68, 0.9);
}

/* Content */
.result-content {
  padding: 1.5rem;
}

.result-item {
  margin-bottom: 1.5rem;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-label {
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

/* Value Box */
.result-value {
  color: #ffffff;
  font-size: 1rem;
  line-height: 1.6;
  padding: 0.75rem 1rem;
  background: rgba(255, 23, 68, 0.45);
  border-left: 3px solid var(--neon-red);
  border-radius: 6px;
}

/* Tags */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  background: linear-gradient(
    135deg,
    rgba(255, 23, 68, 0.6),
    rgba(255, 120, 150, 0.6)
  );
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid var(--neon-red);
  box-shadow: 0 0 10px rgba(255, 23, 68, 0.2);
}

/* Objects List */
.objects-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.objects-list li {
  color: #ffffff;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 23, 68, 0.45);
  border-left: 3px solid var(--neon-red);
  border-radius: 6px;
  font-weight: 500;
}

/* Safety Badge */
.safety-badge {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 23, 68, 0.6),
    rgba(255, 255, 255, 0.15)
  );
  color: #ffffff;
  border: 2px solid var(--neon-red);
  box-shadow: 0 0 15px rgba(255, 23, 68, 0.3);
}

.safety-badge.safe {
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.3),
    rgba(129, 199, 132, 0.3)
  );
  color: #ffffff;
  border-color: #4caf50;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);
}

/* Spinner */
ion-spinner {
  --color: var(--neon-red);
  display: block;
  margin: 1rem auto;
}
</style>
