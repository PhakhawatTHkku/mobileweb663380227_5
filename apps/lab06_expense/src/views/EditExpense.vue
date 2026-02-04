<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/expense-list"></ion-back-button>
        </ion-buttons>
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Loading Indicator -->
      <div v-if="isLoadingData" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Content -->
      <div v-else-if="expense">
        <ion-card>
          <ion-card-header>
            <ion-card-title>แก้ไขข้อมูล</ion-card-title>
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
                @click="handleUpdate"
                :disabled="isLoading"
              >
                <ion-icon slot="start" :icon="checkmark"></ion-icon>
                อัปเดต
              </ion-button>
              <ion-button
                expand="block"
                fill="outline"
                color="danger"
                @click="handleDelete"
                :disabled="isLoading"
              >
                <ion-icon slot="start" :icon="trash"></ion-icon>
                ลบรายการ
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
      </div>

      <!-- Not Found -->
      <div v-else class="not-found">
        <ion-text color="warning">
          <p>ไม่พบข้อมูล</p>
        </ion-text>
        <ion-button router-link="/expense-list" fill="outline">
          กลับไปหน้ารายการ
        </ion-button>
      </div>
    </ion-content>

    <!-- Confirmation Alert Dialog -->
    <ion-alert
      :is-open="isDeleteConfirming"
      header="ยืนยันการลบ"
      message="คุณแน่ใจว่าต้องการลบรายการนี้หรือไม่?"
      :buttons="deleteAlertButtons"
    ></ion-alert>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
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
  IonAlert,
} from '@ionic/vue';
import { useRouter, useRoute } from 'vue-router';
import { checkmark, trash } from 'ionicons/icons';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Router & Route
const router = useRouter();
const route = useRoute();
const expenseId = route.params.id as string;

// Types
interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
  createdAt: any;
}

// State
const expense = ref<Expense | null>(null);
const form = reactive({
  title: '',
  amount: null as number | null,
  type: '',
  category: '',
  note: '',
});

// UI State
const isLoadingData = ref(true);
const isLoading = ref(false);
const errorMessage = ref('');
const isDeleteConfirming = ref(false);

// Delete Alert Buttons
const deleteAlertButtons = [
  {
    text: 'ยกเลิก',
    role: 'cancel',
    handler: () => {
      isDeleteConfirming.value = false;
    },
  },
  {
    text: 'ลบ',
    role: 'destructive',
    handler: () => {
      isDeleteConfirming.value = false;
      performDelete();
    },
  },
];

// Load Data
const loadExpense = async () => {
  try {
    const docRef = doc(db, 'expenses', expenseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      const createdAt = data.createdAt && typeof data.createdAt.toMillis === 'function'
        ? data.createdAt.toMillis()
        : (typeof data.createdAt === 'number' ? data.createdAt : Date.now());

      expense.value = {
        id: docSnap.id,
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category,
        note: data.note || '',
        createdAt,
      };

      // ใส่ค่าลงฟอร์ม
      Object.assign(form, {
        title: expense.value.title,
        amount: expense.value.amount,
        type: expense.value.type,
        category: expense.value.category,
        note: expense.value.note,
      });
    } else {
      console.error('Expense not found');
    }
  } catch (error) {
    console.error('Error loading expense:', error);
    errorMessage.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
  } finally {
    isLoadingData.value = false;
  }
};

// Validation
const validateForm = (): boolean => {
  errorMessage.value = '';

  if (!form.title.trim()) {
    errorMessage.value = 'กรุณากรอกชื่อรายการ';
    return false;
  }

  if (form.amount === null || form.amount <= 0) {
    errorMessage.value = 'กรุณากรอกจำนวนเงินที่มากกว่า 0';
    return false;
  }

  if (!form.type) {
    errorMessage.value = 'กรุณาเลือกประเภท';
    return false;
  }

  if (!form.category) {
    errorMessage.value = 'กรุณาเลือกหมวดหมู่';
    return false;
  }

  return true;
};

// Handle Update
const handleUpdate = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    const docRef = doc(db, 'expenses', expenseId);
    await updateDoc(docRef, {
      title: form.title,
      amount: form.amount,
      type: form.type,
      category: form.category,
      note: form.note,
      updatedAt: serverTimestamp(),
    });

    router.push('/expense-list');
  } catch (error) {
    console.error('Error updating expense:', error);
    errorMessage.value = 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล';
  } finally {
    isLoading.value = false;
  }
};

// Handle Delete Confirm
const handleDelete = () => {
  isDeleteConfirming.value = true;
};

// Perform Delete
const performDelete = async () => {
  isLoading.value = true;

  try {
    const docRef = doc(db, 'expenses', expenseId);
    await deleteDoc(docRef);
    router.push('/expense-list');
  } catch (error) {
    console.error('Error deleting expense:', error);
    errorMessage.value = 'เกิดข้อผิดพลาดในการลบข้อมูล';
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadExpense();
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.loading-container p {
  margin-top: 16px;
  color: var(--ion-color-medium);
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
}

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
