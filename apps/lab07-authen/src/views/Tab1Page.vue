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
  --neon-red: #FF1744;
  --neon-red-light: #FF5983;
  --dark-bg: #0a0e27;
  --dark-card: #1a1f3a;
  --dark-text: #ffffff;
}

.profile-page ::v-deep {
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

.logout-btn {
  color: var(--neon-red);
  font-size: 1.3rem;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: scale(1.1);
  color: var(--neon-red-light);
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
  border: 4px solid var(--neon-red);
  object-fit: cover;
  box-shadow: 0 0 30px rgba(255, 23, 68, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.3);
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
  background: linear-gradient(135deg, var(--dark-card), #252d52);
  color: var(--neon-red);
  border: 4px solid var(--neon-red);
  box-shadow: 0 0 30px rgba(255, 23, 68, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.3);
}

.avatar-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 23, 68, 0.3) 0%, transparent 70%);
  animation: pulse-glow 2s ease-in-out infinite;
  pointer-events: none;
}

.user-info {
  width: 100%;
  max-width: 500px;
}

.profile-card {
  background: linear-gradient(135deg, var(--dark-card), #252d52);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid var(--neon-red);
  box-shadow: 0 10px 30px rgba(255, 23, 68, 0.2);
  backdrop-filter: blur(10px);
}

.card-header {
  margin-bottom: 1.5rem;
}

.card-header h2 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: white;
  font-weight: 700;
}

.neon-underline {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, var(--neon-red), var(--neon-red-light));
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 23, 68, 0.6);
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
  background: rgba(255, 23, 68, 0.05);
  border-radius: 10px;
  border-left: 3px solid var(--neon-red);
  transition: all 0.3s ease;
}

.info-row:hover {
  background: rgba(255, 23, 68, 0.1);
  transform: translateX(5px);
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--neon-red-light);
  font-weight: 600;
  min-width: 120px;
}

.info-label ion-icon {
  font-size: 1.3rem;
}

.info-value {
  color: #b0b0d0;
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
    box-shadow: 0 0 30px rgba(255, 23, 68, 0.3);
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    box-shadow: 0 0 50px rgba(255, 23, 68, 0.5);
    transform: translate(-50%, -50%) scale(1.1);
  }
}
</style>
  padding: 2rem 1rem;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar-placeholder {
  font-size: 5rem;
  color: var(--ion-color-medium);
  margin-bottom: 2rem;
}

.user-info {
  width: 100%;
  max-width: 500px;
}

ion-card {
  margin: 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--ion-color-light);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row label {
  font-weight: 600;
  color: var(--ion-color-dark);
  min-width: 120px;
}

.info-row span {
  color: var(--ion-color-medium);
  word-break: break-all;
  text-align: right;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 1rem;
}

.loading p {
  color: var(--ion-color-medium);
}
</style>