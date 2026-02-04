<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/expense-list"></ion-back-button>
        </ion-buttons>
        <ion-title>เพิ่มรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>บันทึกข้อมูลรายรับ/รายจ่าย</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <!-- ชื่อรายการ -->
          <ion-item>
            <ion-label position="floating">ชื่อรายการ</ion-label>
            <ion-input
              v-model="form.title"
              type="text"
              placeholder="เช่น เงินเดือน หรือ ค่าแก๊ส"
            ></ion-input>
          </ion-item>

          <!-- จำนวนเงิน -->
          <ion-item>
            <ion-label position="floating">จำนวนเงิน</ion-label>
            <ion-input
              v-model.number="form.amount"
              type="number"
              placeholder="0.00"
              min="0"
            ></ion-input>
          </ion-item>

          <!-- ประเภท -->
          <ion-item>
            <ion-label>ประเภท</ion-label>
            <ion-select v-model="form.type" placeholder="เลือกประเภท">
              <ion-select-option value="income">รายรับ</ion-select-option>
              <ion-select-option value="expense">รายจ่าย</ion-select-option>
            </ion-select>
          </ion-item>

          <!-- หมวดหมู่ -->
          <ion-item>
            <ion-label>หมวดหมู่</ion-label>
            <ion-select v-model="form.category" placeholder="เลือกหมวดหมู่">
              <ion-select-option value="เงินเดือน">เงินเดือน</ion-select-option>
              <ion-select-option value="ค่าใช้ชีวิต">ค่าใช้ชีวิต</ion-select-option>
              <ion-select-option value="บัตรเครดิต">บัตรเครดิต</ion-select-option>
              <ion-select-option value="การศึกษา">การศึกษา</ion-select-option>
              <ion-select-option value="สุขภาพ">สุขภาพ</ion-select-option>
              <ion-select-option value="ความบันเทิง">ความบันเทิง</ion-select-option>
              <ion-select-option value="อื่นๆ">อื่นๆ</ion-select-option>
            </ion-select>
          </ion-item>

          <!-- หมายเหตุ -->
          <ion-item>
            <ion-label position="floating">หมายเหตุ</ion-label>
            <ion-textarea
              v-model="form.note"
              placeholder="เพิ่มหมายเหตุ (ไม่บังคับ)"
              :rows="3"
            ></ion-textarea>
          </ion-item>

          <!-- Error Message -->
          <ion-text v-if="errorMessage" color="danger" class="error-text">
            <p>{{ errorMessage }}</p>
          </ion-text>

          <!-- Loading -->
          <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>

          <!-- Buttons -->
          <div class="button-group">
            <ion-button
              expand="block"
              fill="solid"
              color="primary"
              @click="handleSubmit"
              :disabled="isLoading"
            >
              <ion-icon slot="start" :icon="checkmark"></ion-icon>
              บันทึก
            </ion-button>
            <ion-button
              expand="block"
              fill="outline"
              color="medium"
              router-link="/expense-list"
              :disabled="isLoading"
            >
              ยกเลิก
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonButtons,
  IonBackButton,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { checkmark } from 'ionicons/icons';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Router
const router = useRouter();

// Form State
const form = ref({
  title: '',
  amount: null as number | null,
  type: '',
  category: '',
  note: '',
});

// UI State
const isLoading = ref(false);
const errorMessage = ref('');

// Validation
const validateForm = (): boolean => {
  errorMessage.value = '';

  if (!form.value.title.trim()) {
    errorMessage.value = 'กรุณากรอกชื่อรายการ';
    return false;
  }

  if (form.value.amount === null || form.value.amount <= 0) {
    errorMessage.value = 'กรุณากรอกจำนวนเงินที่มากกว่า 0';
    return false;
  }

  if (!form.value.type) {
    errorMessage.value = 'กรุณาเลือกประเภท';
    return false;
  }

  if (!form.value.category) {
    errorMessage.value = 'กรุณาเลือกหมวดหมู่';
    return false;
  }

  return true;
};

// Handle Submit
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    // เพิ่มข้อมูลลง Firestore
    await addDoc(collection(db, 'expenses'), {
      title: form.value.title,
      amount: form.value.amount,
      type: form.value.type,
      category: form.value.category,
      note: form.value.note,
      createdAt: serverTimestamp(), // Auto server timestamp
    });

    // Navigate กลับไปหน้ารายการ
    router.push('/expense-list');
  } catch (error) {
    console.error('Error adding expense:', error);
    errorMessage.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.error-text {
  display: block;
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(248, 113, 113, 0.1);
  border-radius: 4px;
  border-left: 4px solid #f87171;
}

.error-text p {
  margin: 0;
  color: #dc2626;
  font-size: 14px;
}

ion-spinner {
  display: block;
  margin: 16px auto;
}
</style>
