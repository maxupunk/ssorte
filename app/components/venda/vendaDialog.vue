<template>
  <v-dialog v-model="localDialog" max-width="600px">
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Detalhes da Venda</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="localDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <strong>codigo:</strong> {{ selectedItem?.id }}
          </v-col>
          <v-col cols="12">
            <strong>Nome:</strong> {{ selectedItem?.customer?.name }}
          </v-col>
          <v-col cols="12">
            <strong>Telefone:</strong> {{ selectedItem?.customer?.phone }}
          </v-col>
          <v-col cols="12" v-if="selectedItem?.finance">
            <strong>Status Financeiro:</strong> {{ selectedItem?.finance?.status === 1 ? 'Pago' : 'Pendente' }}
          </v-col>
          <v-col cols="12">
            <strong>Sorteio:</strong>
            <div v-for="(product, index) in selectedItem.orderproduct" :key="index">
              <div class="ma-3">Nome: {{ product.product.name }}</div>
              <div class="ma-3">Quantidade: {{ product.quant }}</div>
              <div class="ma-3">
                <strong>Números:</strong>
                <div style="display: flex; flex-wrap: wrap;">
                  <li class="ma-3" v-for="(number, idx) in product.numberlist" :key="idx">
                    <s v-if="number.disabled">{{ number.number }}</s>
                    <span v-else>{{ number.number }}</span>
                  </li>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="desabilitar" v-if="user.rule == 'admin'">Desabilitar</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="warning" @click="abilitar" v-if="user.rule == 'admin'">Habilitar</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="localDialog = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
const useAuth = useAuthStore();
const { user } = storeToRefs(useAuth)

// Define the emit function
const emit = defineEmits(['update'])

const selectedItem = defineModel();

function desabilitar() {
  $fetch(`/api/order/${selectedItem.value.id}/disable`, {
    method: 'PUT',
  }).then((response) => {
    localDialog.value = false
    snackbarShow(response.message, 'success');
    emit('update');
  }).catch(() => {
    snackbarShow('Erro ao desativar venda', 'error');
  });
}

function abilitar() {
  $fetch(`/api/order/${selectedItem.value.id}/enable`, {
    method: 'PUT',
  }).then((response) => {
    localDialog.value = false
    snackbarShow(response.message, 'success');
    emit('update');
  }).catch(() => {
    snackbarShow('Erro ao ativar venda', 'error');
  });
}

const localDialog = computed({
  get: () => !!selectedItem.value.dialog,
  set: (value) => selectedItem.value.dialog = value,
});
</script>