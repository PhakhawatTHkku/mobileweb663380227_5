<template>
  <ion-page class="login-page">
    <ion-content :fullscreen="true">
      <div class="login-wrapper">
        <div class="login-container">
          <div class="logo-section">
            <div class="logo-circle">
              <ion-icon :icon="lockClosedOutline" class="logo-icon"></ion-icon>
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to continue</p>
          </div>

          <div class="login-options">
            <ion-button 
              expand="block" 
              size="large" 
              class="neon-button email-button"
              @click="loginWithEmail">
              <ion-icon slot="start" :icon="mailOutline"></ion-icon>
              Email / Password
            </ion-button>

            <ion-button 
              expand="block" 
              size="large" 
              class="neon-button google-button"
              @click="loginWithGoogle">
              <ion-icon slot="start" :icon="logoGoogle"></ion-icon>
              Google
            </ion-button>

            <ion-button 
              expand="block" 
              size="large" 
              class="neon-button phone-button"
              @click="loginWithPhone">
              <ion-icon slot="start" :icon="callOutline"></ion-icon>
              Phone
            </ion-button>
          </div>

          <div class="terms-text">
            <p>By signing in, you agree to our<br/><strong>Terms of Service</strong> and <strong>Privacy Policy</strong></p>
          </div>
        </div>

        <div class="bg-decorations">
          <div class="decoration decoration-1"></div>
          <div class="decoration decoration-2"></div>
          <div class="decoration decoration-3"></div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton, IonIcon, useIonRouter } from '@ionic/vue';
import { lockClosedOutline, mailOutline, logoGoogle, callOutline } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { authService } from '@/auth/auth-service';

const router = useIonRouter();
const isLoading = ref(true);

onMounted(async () => {
  try {
    const user = await authService.getCurrentUser();
    if (user) {
      router.push('/tabs/tab1');
    }
  } catch (error) {
    console.error('Error checking user:', error);
  } finally {
    isLoading.value = false;
  }
});

const loginWithEmail = async () => {
  try {
    console.log('Email login clicked');
    router.push('/tabs/tab1');
  } catch (error) {
    console.error('Email login error:', error);
  }
};

const loginWithGoogle = async () => {
  try {
    console.log('Google login clicked');
    router.push('/tabs/tab1');
  } catch (error) {
    console.error('Google login error:', error);
  }
};

const loginWithPhone = async () => {
  try {
    console.log('Phone login clicked');
    router.push('/tabs/tab1');
  } catch (error) {
    console.error('Phone login error:', error);
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

.login-page ::v-deep {
  --ion-background-color: var(--dark-bg);
  --ion-text-color: var(--dark-text);
}

.login-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--dark-bg) 0%, #0f1435 50%, #1a0f2e 100%);
  overflow: hidden;
}

.login-container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 100%;
  padding: 2rem 2rem;
  min-height: 100vh;
}

.logo-section {
  text-align: center;
  margin-top: 4rem;
  animation: fadeInDown 0.8s ease-out;
}

.logo-circle {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, var(--neon-red), var(--neon-red-light));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(255, 23, 68, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.logo-icon {
  font-size: 3.5rem;
  color: white;
}

.logo-section h1 {
  font-size: 2.5rem;
  margin: 1rem 0 0.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, var(--neon-red));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.logo-section p {
  color: #b0b0d0;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 300;
}

.login-options {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.2rem;
  margin: 3rem 0;
}

.neon-button {
  margin: 0;
  height: 56px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.neon-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 23, 68, 0.2);
  transition: left 0.3s ease;
}

.neon-button:hover::before {
  left: 100%;
}

.email-button {
  background: linear-gradient(135deg, var(--neon-red), var(--neon-red-light));
  color: white;
  box-shadow: 0 0 20px rgba(255, 23, 68, 0.4);
}

.email-button:hover {
  box-shadow: 0 0 30px rgba(255, 23, 68, 0.7);
  transform: translateY(-2px);
}

.google-button {
  background: linear-gradient(135deg, #1a1f3a, #252d52);
  color: white;
  border: 2px solid var(--neon-red);
  box-shadow: 0 0 15px rgba(255, 23, 68, 0.3);
}

.google-button:hover {
  background: linear-gradient(135deg, #252d52, #2a3560);
  box-shadow: 0 0 25px rgba(255, 23, 68, 0.6);
  transform: translateY(-2px);
}

.phone-button {
  background: linear-gradient(135deg, #1a1f3a, #252d52);
  color: white;
  border: 2px solid var(--neon-red-light);
  box-shadow: 0 0 15px rgba(255, 89, 131, 0.3);
}

.phone-button:hover {
  background: linear-gradient(135deg, #252d52, #2a3560);
  box-shadow: 0 0 25px rgba(255, 89, 131, 0.6);
  transform: translateY(-2px);
}

.terms-text {
  text-align: center;
  font-size: 0.85rem;
  color: #8a8aad;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.terms-text p {
  margin: 0;
}

.terms-text strong {
  color: var(--neon-red);
  font-weight: 600;
}

.bg-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.decoration {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(40px);
}

.decoration-1 {
  width: 300px;
  height: 300px;
  background: var(--neon-red);
  top: -50px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.decoration-2 {
  width: 200px;
  height: 200px;
  background: var(--neon-red-light);
  bottom: 100px;
  left: -50px;
  animation: float 10s ease-in-out infinite reverse;
}

.decoration-3 {
  width: 250px;
  height: 250px;
  background: var(--neon-red);
  bottom: -50px;
  right: 50px;
  animation: float 12s ease-in-out infinite;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 30px rgba(255, 23, 68, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 23, 68, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.3);
    transform: scale(1.02);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(30px);
  }
}

ion-icon {
  margin-right: 8px;
}
</style>
  margin-top: 1rem;
}

.terms-text p {
  margin: 0;
  line-height: 1.4;
}
</style>