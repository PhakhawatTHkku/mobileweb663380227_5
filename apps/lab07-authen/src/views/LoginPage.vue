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

          <div class="login-options" v-if="!showEmailForm && !showPhoneForm">
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

          <div v-if="showEmailForm" class="login-form">
            <ion-item>
              <ion-label position="floating">Email</ion-label>
              <ion-input v-model="email" type="email" placeholder="Enter your email"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Password</ion-label>
              <ion-input v-model="password" type="password" placeholder="Enter your password"></ion-input>
            </ion-item>
            <ion-button expand="block" @click="doEmailLogin" :disabled="!email || !password">Login</ion-button>
            <ion-button expand="block" fill="clear" @click="cancelEmailForm">Cancel</ion-button>
          </div>

          <div v-if="showPhoneForm" class="login-form">
            <div v-if="phoneStep === 'input'">
              <ion-item>
                <ion-label position="floating">Phone Number</ion-label>
                <ion-input v-model="phone" type="tel" placeholder="+66812345678"></ion-input>
              </ion-item>
              <ion-button expand="block" @click="doStartPhoneLogin" :disabled="!phone">Send Code</ion-button>
            </div>
            <div v-if="phoneStep === 'verify'">
              <ion-item>
                <ion-label position="floating">Verification Code</ion-label>
                <ion-input v-model="verificationCode" type="text" placeholder="Enter 6-digit code"></ion-input>
              </ion-item>
              <ion-button expand="block" @click="doVerifyPhone" :disabled="!verificationCode">Verify</ion-button>
            </div>
            <ion-button expand="block" fill="clear" @click="cancelPhoneForm">Cancel</ion-button>
          </div>

          <div id="recaptcha-container"></div>

          <div v-if="statusMessage" :class="['status-message', `status-${statusType}`]">
            <strong>{{ statusType === 'success' ? '✓' : statusType === 'error' ? '✕' : 'ℹ' }}</strong> {{ statusMessage }}
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
import { IonPage, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonInput, useIonRouter } from '@ionic/vue';
import { lockClosedOutline, mailOutline, logoGoogle, callOutline } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { authService } from '@/auth/auth-service';

const router = useIonRouter();
const isLoading = ref(true);

const email = ref('')
const password = ref('')
const showEmailForm = ref(false)
const showPhoneForm = ref(false)
const phone = ref('')
const verificationCode = ref('')
const verificationId = ref('')
const phoneStep = ref('input')
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | 'info' | ''>('')

const clearStatus = () => {
  statusMessage.value = ''
  statusType.value = ''
}

const showStatus = (message: string, type: 'success' | 'error' | 'info') => {
  statusMessage.value = message
  statusType.value = type
  console.log(`[${type.toUpperCase()}] ${message}`)
  setTimeout(clearStatus, 5000)
}

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

const loginWithEmail = () => {
  showEmailForm.value = true
}

const doEmailLogin = async () => {
  if (!email.value || !password.value) return
  try {
    showStatus('Logging in with email...', 'info')
    await authService.loginWithEmailPassword({email: email.value, password: password.value})
    showStatus('Login successful! Redirecting...', 'success')
    setTimeout(() => router.push('/tabs/tab1'), 1000)
  } catch (error: any) {
    const message = error?.message || 'Email login failed'
    if (message.includes('user-not-found') || message.includes('auth/user-not-found')) {
      showStatus('Account not found!', 'error')
    } else if (message.includes('wrong-password') || message.includes('auth/wrong-password')) {
      showStatus('Wrong password!', 'error')
    } else {
      showStatus(`Login failed: ${message}`, 'error')
    }
    console.error('Email login error:', error)
  }
}

const loginWithGoogle = async () => {
  try {
    showStatus('Logging in with Google...', 'info')
    await authService.loginWithGoogle()
    showStatus('Login successful! Redirecting...', 'success')
    setTimeout(() => router.push('/tabs/tab1'), 1000)
  } catch (error: any) {
    showStatus('Google login failed!', 'error')
    console.error('Google login error:', error)
  }
}

const loginWithPhone = () => {
  showPhoneForm.value = true
  phoneStep.value = 'input'
}

const doStartPhoneLogin = async () => {
  if (!phone.value) return
  try {
    showStatus('Sending verification code...', 'info')
    const result = await authService.startPhoneLogin({phoneNumberE164: phone.value})
    verificationId.value = result.verificationId
    phoneStep.value = 'verify'
    showStatus('Code sent! Check your SMS.', 'success')
  } catch (error: any) {
    const message = error?.message || 'Failed to send code'
    if (message.includes('invalid') || message.includes('country')) {
      showStatus('Invalid phone number!', 'error')
    } else {
      showStatus(`Failed to send code: ${message}`, 'error')
    }
    console.error('Phone login start error:', error)
  }
}

const doVerifyPhone = async () => {
  if (!verificationCode.value) return
  try {
    showStatus('Verifying code...', 'info')
    await authService.confirmPhoneCode({verificationId: verificationId.value, verificationCode: verificationCode.value})
    showStatus('Login successful! Redirecting...', 'success')
    setTimeout(() => router.push('/tabs/tab1'), 1000)
  } catch (error: any) {
    const message = error?.message || 'Verification failed'
    if (message.includes('invalid') || message.includes('expired')) {
      showStatus('Invalid or expired code!', 'error')
    } else {
      showStatus(`Verification failed: ${message}`, 'error')
    }
    console.error('Phone verify error:', error)
  }
}

const cancelEmailForm = () => {
  showEmailForm.value = false
  email.value = ''
  password.value = ''
}

const cancelPhoneForm = () => {
  showPhoneForm.value = false
  phone.value = ''
  verificationCode.value = ''
  phoneStep.value = 'input'
}
</script>

<style scoped>
:root {
  --primary-blue: #007bff;
  --primary-blue-light: #0056b3;
  --light-bg: #ffffff;
  --light-card: #f8f9fa;
  --dark-text: #000000;
}

.login-page ::v-deep {
  --ion-background-color: var(--light-bg);
  --ion-text-color: var(--dark-text);
}

.login-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--light-bg) 0%, #f0f0f0 50%, #e0e0e0 100%);
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

.login-form {
  margin: 1rem 0;
  padding: 1rem;
  background: var(--light-card);
  border-radius: 12px;
  border: 1px solid var(--primary-blue);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.status-message {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

.status-success {
  background: #d4edda;
  border-left-color: #28a745;
  color: #155724;
}

.status-error {
  background: #f8d7da;
  border-left-color: #dc3545;
  color: #721c24;
}

.status-info {
  background: #d1ecf1;
  border-left-color: #17a2b8;
  color: #0c5460;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
  background: linear-gradient(135deg, #000000, var(--primary-blue));
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
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light));
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.email-button:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transform: translateY(-2px);
}

.google-button {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #000000;
  border: 2px solid var(--primary-blue);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.google-button:hover {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transform: translateY(-2px);
}

.phone-button {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #000000;
  border: 2px solid var(--primary-blue);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.phone-button:hover {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transform: translateY(-2px);
}

.terms-text {
  text-align: center;
  font-size: 0.85rem;
  color: #666666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.terms-text p {
  margin: 0;
}

.terms-text strong {
  color: var(--primary-blue);
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
  opacity: 0.05;
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
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 6px 12px rgba(0,0,0,0.2);
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