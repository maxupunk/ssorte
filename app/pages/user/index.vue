<template>
    <appBar title="Lista de usuario">
        <v-btn icon="mdi-plus" variant="text" @click="createUser"></v-btn>
    </appBar>
    <v-container>
        <v-data-table :headers="headers" :items="userList" @click:row="openUser"></v-data-table>
        <user-form v-model="selectedItem" @update="fetchUsers" />
    </v-container>
</template>

<script setup lang="ts">
import appBar from '~/components/appBar.vue'
import { snackbarShow } from "~/composables/useUi"
import userForm from '~/components/user/userForm.vue';

const userList = ref([])

const headers = [
    { title: 'Nome', value: 'name' },
    { title: 'pix', value: 'pix' },
    { title: 'Comisão', value: 'commissionPercent' },
    { title: 'Perfil', value: 'rule' },
    { title: 'ativo', value: 'active' },
]

const selectedItem = ref({})

function createUser() {
    selectedItem.value = { dialog: true }
}

function openUser(e: any, { item }: any) {
    selectedItem.value = { ...item, dialog: true }
}

function fetchUsers() {
    $fetch('/api/user').then((data: any) => {
        if (data) {
            userList.value = data
        }
    }).catch(() => {
        snackbarShow('Erro ao buscar usuarios', 'error')
    })
}

onMounted(() => {
    fetchUsers()
})
</script>