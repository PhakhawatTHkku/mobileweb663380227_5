<template>
  <ion-page class="profile-page">
    <ion-header :translucent="true" class="header-neon">
      <ion-toolbar class="toolbar-neon">
        <ion-title>Profile</ion-title>
        <ion-buttons slot="end">
          <ion-button class="logout-btn" @click="logout">
            <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="content-neon">
      <ion-header collapse="condense">
        <ion-toolbar class="toolbar-neon">
          <ion-title size="large">User Profile</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="user" class="user-profile">
        <div class="user-avatar-wrapper">
          <div class="user-avatar" v-if="user.photoUrl">
            <img :src="user.photoUrl" :alt="user.displayName || 'User'" />
          </div>
          <div v-else class="user-avatar-placeholder">
            <ion-icon :icon="personCircleOutline"></ion-icon>
          </div>
          <div class="avatar-glow"></div>
        </div>

        <div class="user-info">
          <div class="profile-card">
            <div class="card-header">
              <h2>{{ user.displayName || 'User Profile' }}</h2>
              <div class="neon-underline"></div>
            </div>

            <div class="card-content">
              <div class="info-row">
                <div class="info-label">
                  <ion-icon :icon="personCircleOutline"></ion-icon>
                  <span>UID</span>
                </div>
                <span class="info-value">{{ user.uid }}</span>
              </div>

              <div class="info-row" v-if="user.email">
                <div class="info-label">
                  <ion-icon :icon="mailOutline"></ion-icon>
                  <span>Email</span>
                </div>
                <span class="info-value">{{ user.email }}</span>
              </div>

              <div class="info-row" v-if="user.phoneNumber">
                <div class="info-label">
                  <ion-icon :icon="callOutline"></ion-icon>
                  <span>Phone</span>
                </div>
                <span class="info-value">{{ user.phoneNumber }}</span>
              </div>

              <div class="info-row" v-if="user.displayName">
                <div class="info-label">
                  <ion-icon :icon="personOutline"></ion-icon>
                  <span>Display Name</span>
                </div>
                <span class="info-value">{{ user.displayName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="loading">
        <ion-spinner color="danger"></ion-spinner>
        <p>Loading user information...</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, IonSpinner, useIonRouter } from '@ionic/vue';
import { personCircleOutline, logOutOutline, mailOutline, callOutline, personOutline } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { authService } from '@/auth/auth-service';

interface AuthUser {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
}

const router = useIonRouter();
const user = ref<AuthUser | null>(null);

onMounted(async () => {
  try {
    user.value = await authService.getCurrentUser();
  } catch (error) {
    console.error('Error fetching user:', error);
  }
});

const logout = async () => {
  try {
    await authService.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<style scoped>
:root {
  --primary-blue: #007bff;
  --primary-blue-light: #0056b3;
  --light-bg: #ffffff;
  --light-card: #f8f9fa;
  --dark-text: #000000;
}

.profile-page ::v-deep {
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

.logout-btn {
  color: var(--primary-blue);
  font-size: 1.3rem;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: scale(1.1);
  color: var(--primary-blue-light);
}

.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  min-height: 100%;
}

.user-avatar-wrapper {
  position: relative;
  margin-bottom: 3rem;
  margin-top: 1rem;
}

.user-avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--primary-blue);
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar-placeholder {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5.5rem;
  background: linear-gradient(135deg, var(--light-card), #e9ecef);
  color: var(--primary-blue);
  border: 4px solid var(--primary-blue);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.avatar-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,123,255,0.1) 0%, transparent 70%);
  animation: pulse-glow 2s ease-in-out infinite;
  pointer-events: none;
}

.user-info {
  width: 100%;
  max-width: 500px;
}

.profile-card {
  background: linear-gradient(135deg, var(--light-card), #e9ecef);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid var(--primary-blue);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.card-header {
  margin-bottom: 1.5rem;
}

.card-header h2 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: black;
  font-weight: 700;
}

.neon-underline {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-blue-light));
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0,123,255,0.3);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(0,123,255,0.05);
  border-radius: 10px;
  border-left: 3px solid var(--primary-blue);
  transition: all 0.3s ease;
}

.info-row:hover {
  background: rgba(0,123,255,0.1);
  transform: translateX(5px);
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--primary-blue);
  font-weight: 600;
  min-width: 120px;
}

.info-label ion-icon {
  font-size: 1.3rem;
}

.info-value {
  color: #666666;
  word-break: break-all;
  text-align: right;
  font-size: 0.95rem;
  max-width: 60%;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 1.5rem;
}

.loading p {
  color: #8a8aad;
  font-size: 1.1rem;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(0,123,255,0.1);
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    box-shadow: 0 0 20px rgba(0,123,255,0.2);
    transform: translate(-50%, -50%) scale(1.05);
  }
}
</style>