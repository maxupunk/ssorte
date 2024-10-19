<template>
    <appBar title="Produtos">
    </appBar>
    <v-container>
        <v-data-table :headers="headers" :items="ProductList" @click:row="openProduct"></v-data-table>
        <produtoForm v-model="selectedItem" @update="fetchProducts"></produtoForm>
    </v-container>
</template>

<script setup lang="ts">
import appBar from '~/components/appBar.vue'
import produtoForm from '~/components/produto/produtoForm.vue';

const ProductList = ref([])

const headers = [
    { title: 'Nome', key: 'name' },
    { title: 'preço', key: 'price' },
    { title: 'Venda Minima', key: 'daleMin' },
    { title: 'Numero Da Loteria', key: 'numLottery' },
    { title: 'ativo', key: 'active' },
]

const selectedItem = ref({})

function openProduct(e: any, { item }: any) {
    selectedItem.value = { ...item, dialog: true }
}

function fetchProducts() {
    $fetch('/api/product').then((data: any) => {
        if (data) {
            ProductList.value = data
        }
    }).catch(() => {
        snackbarShow('Erro ao buscar produtos', 'error')
    })
}

onMounted(() => {
    fetchProducts()
})
</script>