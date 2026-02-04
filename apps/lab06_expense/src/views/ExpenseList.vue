<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Expense Tracker</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/add-expense" color="primary">
            <ion-icon slot="icon-only" :icon="addCircle"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Summary Cards -->
      <div class="summary-container">
        <ion-card class="summary-card income">
          <ion-card-header>
            <ion-card-title>รายรับ</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="amount">{{ formatCurrency(incomeTotal) }}</div>
          </ion-card-content>
        </ion-card>

        <ion-card class="summary-card expense">
          <ion-card-header>
            <ion-card-title>รายจ่าย</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="amount">{{ formatCurrency(expenseTotal) }}</div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Balance Card -->
      <ion-card class="balance-card">
        <ion-card-content>
          <div class="balance-label">ยอดคงเหลือ</div>
          <div class="balance-amount" :class="balance >= 0 ? 'positive' : 'negative'">
            {{ formatCurrency(balance) }}
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Expense List -->
      <ion-list v-if="expenses.length > 0">
        <ion-list-header>
          <ion-label>รายการ</ion-label>
        </ion-list-header>
        <ion-item
          v-for="expense in expenses"
          :key="expense.id"
          @click="goToEdit(expense.id)"
          button
        >
          <div class="expense-item">
            <div class="expense-info">
              <ion-label class="expense-title">{{ expense.title }}</ion-label>
              <ion-text class="expense-category">
                {{ expense.category }} • {{ new Date(expense.createdAt).toLocaleDateString('th-TH') }}
              </ion-text>
            </div>
            <div class="expense-amount" :class="expense.type === 'income' ? 'income' : 'expense'">
              {{ expense.type === 'income' ? '+' : '-' }}{{ formatCurrency(expense.amount) }}
            </div>
          </div>
        </ion-item>
      </ion-list>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <ion-icon :icon="emptyIcon" size="large"></ion-icon>
        <p>ยังไม่มีรายการ</p>
        <ion-button router-link="/add-expense" fill="solid" color="primary">
          เพิ่มรายการแรก
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonText,
  IonButtons,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { addCircle, fileTrayOutline } from 'ionicons/icons';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Router
const router = useRouter();

// icons
const emptyIcon = fileTrayOutline;

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

// Reactive State
const expenses = ref<Expense[]>([]);
let unsubscribe: (() => void) | null = null;

// Computed Properties
const incomeTotal = computed(() => {
  return expenses.value
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
});

const expenseTotal = computed(() => {
  return expenses.value
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
});

const balance = computed(() => incomeTotal.value - expenseTotal.value);

// Methods
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(value);
};

const goToEdit = (id: string) => {
  router.push(`/edit-expense/${id}`);
};

// Setup Realtime Listener
const setupRealtimeListener = () => {
  try {
    // Query: order by createdAt descending (newest first)
    const q = query(
      collection(db, 'expenses'),
      orderBy('createdAt', 'desc')
    );

    // onSnapshot สำหรับ realtime updates
    unsubscribe = onSnapshot(q, (snapshot) => {
      expenses.value = snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        // createdAt from serverTimestamp is a Firestore Timestamp object
        // convert to milliseconds for easy use in templates
        const createdAt = data.createdAt && typeof data.createdAt.toMillis === 'function'
          ? data.createdAt.toMillis()
          : (typeof data.createdAt === 'number' ? data.createdAt : Date.now());

        return {
          id: doc.id,
          title: data.title,
          amount: data.amount,
          type: data.type,
          category: data.category,
          note: data.note || '',
          createdAt,
        } as Expense;
      });
    });
  } catch (error) {
    console.error('Error setting up listener:', error);
  }
};

// Lifecycle
onMounted(() => {
  setupRealtimeListener();
});

// ลบ listener เมื่อออกจากหน้า
onBeforeUnmount(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
.summary-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.summary-card {
  margin: 0;
}

.summary-card ion-card-title {
  font-size: 14px;
  margin: 0;
}

.amount {
  font-size: 24px;
  font-weight: bold;
  margin-top: 8px;
}

.income .amount {
  color: #4ade80;
}

.expense .amount {
  color: #f87171;
}

.balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 20px;
}

.balance-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.balance-amount {
  font-size: 32px;
  font-weight: bold;
}

.balance-amount.positive {
  color: #4ade80;
}

.balance-amount.negative {
  color: #f87171;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 0;
}

.expense-info {
  flex: 1;
}

.expense-title {
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.expense-category {
  font-size: 12px;
  color: var(--ion-color-medium);
}

.expense-amount {
  font-weight: bold;
  font-size: 16px;
  text-align: right;
}

.expense-amount.income {
  color: #4ade80;
}

.expense-amount.expense {
  color: #f87171;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
}

.empty-state ion-icon {
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--ion-color-medium);
  margin-bottom: 24px;
}
</style>
