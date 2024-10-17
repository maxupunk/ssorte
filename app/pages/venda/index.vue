<template>
    <appBar title="Lista de vendas">
        <v-btn to="/venda/add" icon="mdi-plus" variant="text"></v-btn>
    </appBar>
    <v-container>
        <v-data-table :headers="headers" :items="vendasList" @click:row="openDialog"></v-data-table>
        <venda-dialog v-model="selectedItem"></venda-dialog>
    </v-container>
</template>

<script setup lang="ts">
import appBar from '~/components/appBar.vue'
import { snackbarShow } from "~/composables/useUi"
import { ref, onMounted } from 'vue'
import vendaDialog from '~/components/venda/vendaDialog.vue';

const vendasList = ref([])

const headers = [
    { title: 'Nome', key: 'customer.name' },
    { title: 'Telefone', key: 'customer.phone' },
    { title: 'Vendedor', key: 'user.name' },
    { title: 'Financeiro Status', key: 'finance.status' },
    { title: 'Quantidade', key: 'orderproduct[0].quant' },
]
const selectedItem = ref({})

function fetchVendas() {
    $fetch('/api/order').then((data: any) => {
        if (data) {
            vendasList.value = data
        }
    }).catch(() => {
        snackbarShow('Erro ao buscar vendas', 'error')
    })
}

function openDialog(e: any, { item }: any) {
    selectedItem.value = { ...item, dialog: true }
}

onMounted(() => {
    fetchVendas()
})
</script>