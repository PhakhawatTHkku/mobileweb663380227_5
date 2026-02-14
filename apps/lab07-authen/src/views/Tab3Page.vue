<template>
  <ion-page class="tab-page">
    <ion-header :translucent="true" class="header-neon">
      <ion-toolbar class="toolbar-neon">
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="content-neon">
      <ion-header collapse="condense">
        <ion-toolbar class="toolbar-neon">
          <ion-title size="large">Settings</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="tab-container">
        <div class="section-header">
          <h2>Preferences</h2>
          <div class="neon-line"></div>
        </div>
        
        <div class="settings-list">
          <div class="setting-item" v-for="i in 5" :key="i">
            <div class="setting-info">
              <ion-icon :icon="settingsOutline" class="setting-icon"></ion-icon>
              <div>
                <div class="setting-title">Setting {{ i }}</div>
                <div class="setting-description">Configure option {{ i }}</div>
              </div>
            </div>
            <ion-toggle :checked="true" color="primary"></ion-toggle>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonToggle } from '@ionic/vue';
import { settingsOutline } from 'ionicons/icons';
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

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, var(--light-card), #e9ecef);
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid var(--primary-blue);
  transition: all 0.3s ease;
}

.setting-item:hover {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  box-shadow: 0 8px 20px rgba(0,123,255,0.1);
  transform: translateX(5px);
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.setting-icon {
  font-size: 1.5rem;
  color: var(--primary-blue);
}

.setting-title {
  font-weight: 600;
  color: black;
  margin-bottom: 0.25rem;
}

.setting-description {
  font-size: 0.85rem;
  color: #666666;
}

ion-toggle {
  --handle-background: white;
  --handle-background-checked: white;
}
</style>
