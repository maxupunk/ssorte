<template>
  <v-dialog v-model="localDialog" max-width="600px">
    <v-card>
      <v-card-title>Detalhes da Venda</v-card-title>
      <v-card-text>
        <div class="my-3">
          <strong>Nome:</strong> {{ selectedItem?.customer?.name }}
        </div>
        <div class="my-3">
          <strong>Telefone:</strong> {{ selectedItem?.customer?.phone }}
        </div>
        <div class="my-3">
          <strong>Status Financeiro:</strong> {{ selectedItem?.finance?.status === 1 ? 'Pago' : 'Pendente' }}
        </div>
        <div>
          <strong>Sorteio:</strong>
          <div v-for="(product, index) in selectedItem.orderproduct" :key="index">
            <div class="ma-3">Nome: {{ product.product.name }}</div>
            <div class="ma-3">Quantidade: {{ product.quant }}</div>
            <div class="ma-3">
              <strong>Números:</strong>
              <div style="display: flex; flex-wrap: wrap;">
                <li class="ma-3" v-for="(number, idx) in product.numberlist" :key="idx">
                  {{ number.number }}
                </li>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="localDialog = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const selectedItem = defineModel();

const localDialog = computed({
  get: () => !!selectedItem.value.dialog,
  set: (value) => selectedItem.value.dialog = value,
});
</script>