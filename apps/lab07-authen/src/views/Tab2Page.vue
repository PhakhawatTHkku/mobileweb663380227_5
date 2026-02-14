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
  --primary-blue: #007bff;
  --primary-blue-light: #0056b3;
  --light-bg: #ffffff;
  --light-card: #f8f9fa;
  --dark-text: #000000;
}

.tab-page ::v-deep {
  --ion-background-color: var(--light-bg);
  --ion-text-color: var(--dark-text);
}

.header-neon {
  --ion-toolbar-background: linear-gradient(135deg, var(--light-card) 0%, #e9ecef 100%);
}

.toolbar-neon {
  --ion-toolbar-color: black;
  border-bottom: 2px solid var(--primary-blue);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

ion-content {
  background: linear-gradient(135deg, var(--light-bg) 0%, #f0f0f0 50%, #e0e0e0 100%);
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
  color: black;
  font-weight: 700;
  background: linear-gradient(135deg, #000000, var(--primary-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.neon-line {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-blue-light));
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0,123,255,0.3);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.content-card {
  background: linear-gradient(135deg, var(--light-card), #e9ecef);
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid var(--primary-blue);
  transition: all 0.3s ease;
  cursor: pointer;
}

.content-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(0,123,255,0.1);
  border-color: var(--primary-blue-light);
}

.card-placeholder {
  width: 100%;
  aspect-ratio: 1;
  background: rgba(0,123,255,0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  color: var(--primary-blue);
}

.card-label {
  text-align: center;
  color: #666666;
  font-weight: 500;
  font-size: 0.9rem;
}
</style>
