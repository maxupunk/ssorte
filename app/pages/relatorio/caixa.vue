<template>
    <appBar title="Relatorio de vendas">
    </appBar>
    <v-container>
        <v-card>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="4" sm="4">
                        <v-select v-model="userID" :items="usersList" item-title="name" item-value="id" label="Vendedor"
                            @update:modelValue="fetchRepost" clearable />
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                        <v-text-field v-model="dateStart" label="Data Inicial" type="date"
                            @update:modelValue="fetchRepost" />
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                        <v-text-field v-model="dateEnd" label="Data Final" type="date"
                            @update:modelValue="fetchRepost" />
                    </v-col>
                </v-row>
            </v-card-text>
            <v-data-table :headers="headers" :items="report">
                <template #item.total="{ item }">
                    R$ {{ currencyFormat(item.total) }}
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import appBar from '~/components/appBar.vue'
import currencyFormat from '@/utils/currencyFormat';

interface ReportItem {
  name: string;
  total: number;
}

const usersList = ref([])
const report = ref<ReportItem[]>([])
const userID = ref()
const dateStart = ref('')
const dateEnd = ref('')

const headers = [
    { title: 'Nome', key: 'name' },
    { title: 'Total', key: 'total' },
]

function fetchRepost() {
    $fetch('/api/report/sale', {
        method: 'POST',
        body: {
            userId: userID.value,
            dateStart: dateStart.value,
            dateEnd: dateEnd.value,
        },
    }).then((data: any) => {
        if (data) {
            report.value = data
        }
    }).catch(() => {
        snackbarShow('Erro ao buscar relatorio', 'error')
    })
}

function fetchUsers() {
    $fetch('/api/user/list').then((data: any) => {
        if (data) {
            usersList.value = data
        }
    }).catch(() => {
        snackbarShow('Erro ao buscar usuarios', 'error')
    })
}

onMounted(() => {
    fetchUsers()
})
</script>