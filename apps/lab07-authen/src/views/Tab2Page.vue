<template>
  <ion-page class="tab-page">
    <ion-header :translucent="true" class="header-neon">
      <ion-toolbar class="toolbar-neon">
        <ion-title>Gallery</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="content-neon">
      <ion-header collapse="condense">
        <ion-toolbar class="toolbar-neon">
          <ion-title size="large">Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="tab-container">
        <div class="section-header">
          <h2>Explore</h2>
          <div class="neon-line"></div>
        </div>
        
        <div class="content-grid">
          <div class="content-card" v-for="i in 6" :key="i">
            <div class="card-placeholder">
              <ion-icon :icon="imageOutline"></ion-icon>
            </div>
            <div class="card-label">Item {{ i }}</div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/vue';
import { imageOutline } from 'ionicons/icons';
</script>

<style scoped>
:root {
  --neon-red: #FF1744;
  --neon-red-light: #FF5983;
  --dark-bg: #0a0e27;
  --dark-card: #1a1f3a;
  --dark-text: #ffffff;
}

.tab-page ::v-deep {
  --ion-background-color: var(--dark-bg);
  --ion-text-color: var(--dark-text);
}

.header-neon {
  --ion-toolbar-background: linear-gradient(135deg, var(--dark-card) 0%, #1a1f3a 100%);
}

.toolbar-neon {
  --ion-toolbar-color: white;
  border-bottom: 2px solid var(--neon-red);
  box-shadow: 0 2px 15px rgba(255, 23, 68, 0.2);
}

ion-content {
  background: linear-gradient(135deg, var(--dark-bg) 0%, #0f1435 50%, #1a0f2e 100%);
}

.tab-container {
  padding: 2rem 1rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: white;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, var(--neon-red));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.neon-line {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, var(--neon-red), var(--neon-red-light));
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 23, 68, 0.6);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.content-card {
  background: linear-gradient(135deg, var(--dark-card), #252d52);
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid var(--neon-red);
  transition: all 0.3s ease;
  cursor: pointer;
}

.content-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(255, 23, 68, 0.3);
  border-color: var(--neon-red-light);
}

.card-placeholder {
  width: 100%;
  aspect-ratio: 1;
  background: rgba(255, 23, 68, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  color: var(--neon-red);
}

.card-label {
  text-align: center;
  color: #b0b0d0;
  font-weight: 500;
  font-size: 0.9rem;
}
</style>
