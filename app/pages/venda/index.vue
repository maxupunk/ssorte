<template>
    <appBar title="Vendas" :loading="loading">
        <v-text-field label="Pesquisar" hide-details variant="outlined" clearable @update:modelValue="searchVendas"
            :loading="loading" :disabled="loading"></v-text-field>
        <v-spacer></v-spacer>
        <v-btn to="/venda/add" icon="mdi-plus" variant="text"></v-btn>
    </appBar>
    <v-container>
        <v-data-table :headers="headers" :items="vendasList" @click:row="openDialog">
            <template #item.status="{ item }">
                <v-chip :color="item.status === 0 ? 'success' : 'error'">
                    {{ item.status === 0 ? 'habilitada' : 'Desabilitada' }}
                </v-chip>
            </template>
        </v-data-table>
        <venda-dialog v-model="selectedItem" @update="fetchVendas()"></venda-dialog>
    </v-container>
</template>

<script setup lang="ts">
import appBar from '~/components/appBar.vue'
import { snackbarShow } from "~/composables/useUi"
import { ref, onMounted } from 'vue'
import vendaDialog from '~/components/venda/vendaDialog.vue';

interface VendaItem {
    customer: {
        name: string;
        phone: string;
    };
    user: {
        name: string;
    };
    status: number;
}

const vendasList = ref<VendaItem[]>([])

const headers = [
    { title: 'Nome', key: 'customer.name' },
    { title: 'Telefone', key: 'customer.phone' },
    { title: 'Vendedor', key: 'user.name' },
    { title: 'Status', key: 'status' },
]
const selectedItem = ref({})
let timeoutId: any = null
const loading = ref(false)

function searchVendas(search: string) {
    if (timeoutId) {
        clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
        fetchVendas(search)
    }, 500)
}

function fetchVendas(search = '' as string) {
    loading.value = true
    const query = search ? `?search=${search}` : ''
    $fetch(`/api/order${query}`).then((data: any) => {
        vendasList.value = data
    }).catch(() => {
        snackbarShow('Erro ao buscar vendas', 'error')
    }).finally(() => {
        loading.value = false
    })
}

function openDialog(e: any, { item }: any) {
    selectedItem.value = { ...item, dialog: true }
}

onMounted(() => {
    fetchVendas()
})
</script>