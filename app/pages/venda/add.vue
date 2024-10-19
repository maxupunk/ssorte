<template>
    <appBar title="Venda" :loading="loading" />
    <v-container>
        <v-card>
            <v-form v-model="valid" :disabled="finished">
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-text-field label="Nome do participante" v-model="customer.name" :rules="ruleName" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field label="Numero do telefone" v-maska="'(##) 9 ####-####'"
                                v-model="customer.phone" :rules="rulePhone" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-select label="Sorteio" v-model="orderProduct.productId" :items="productList"
                                item-title="name" item-value="id" @update:modelValue="selectProduct" return-object
                                :rules="ruleProduct" />
                        </v-col>
                        <v-col cols="12">
                            <v-number-input label="Quantidade" v-model="orderProduct.quant"
                                :min="orderProduct.saleMin" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Total:
                            <h1>{{ formatMoney(orderProduct.quant * orderProduct.price) }}</h1>
                        </v-col>
                        <v-col>
                            <v-checkbox v-model="paid" :rules="rulePaid" label="Confirma que esta pago?"></v-checkbox>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-form>
            <v-card-actions>
                <v-row>
                    <v-col>
                        <v-btn color="success" variant="tonal" @click="confirVenda()" :disabled="!valid || finished"
                            :loading="loading" block>Confirmar venda</v-btn>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-btn color="primary" :disabled="!finished" variant="tonal" @click="resume.dialog = true" block
                            :loading="loading">Comprovante</v-btn>
                    </v-col cols="12" md="4">
                    <v-col cols="12" md="4">
                        <v-btn :color="valid ? 'warning' : 'success'" variant="tonal" @click="setNewOrder" block
                            :loading="loading">Nova
                            Venda</v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
        <venda-dialog v-model="resume"></venda-dialog>
    </v-container>
</template>

<script setup lang="ts">
import appBar from '~/components/appBar.vue'
import vendaDialog from '~/components/venda/vendaDialog.vue';
// @ts-ignore
import { vMaska } from "maska/vue"
import { formatMoney } from '~/composables/useMoney'

const valid = ref(false)
const customer = ref({}) as any
const orderProduct = ref({}) as any
const paid = ref(false)
const productList = ref([]) as any
const resume = ref({}) as any
const finished = ref(false)
const newOrder = ref(false)
const loading = ref(false)

const ruleName = [(v: string) => {
    return !!v || 'Nome é obrigatório'
}, (v: string) => {
    return v.length >= 3 || 'Nome deve ter no mínimo 3 caracteres'
}]

const rulePhone = [(v: string) => {
    return !!v || 'Telefone é obrigatório'
}, (v: string) => {
    return v.length >= 16 || 'Telefone inválido'
}]

const ruleProduct = [(v: string) => {
    return !!v || 'Você deve selecionar um sorteio'
}]

const rulePaid = [(v: boolean) => {
    return !!v || 'Você deve confirmar que esta pago'
}]

const selectProduct = (value: any) => {
    orderProduct.value = { productId: value.id, quant: value.saleMin, saleMin: value.saleMin, price: value.price }
}

const confirVenda = async () => {
    loading.value = true
    const formData = {
        customer: {
            name: customer.value.name,
            phone: extractNumbers(customer.value.phone)
        },
        orderProduct: {
            productId: orderProduct.value.productId,
            quant: orderProduct.value.quant
        },
        paid: paid.value
    }
    await $fetch('/api/order', {
        method: 'POST',
        body: formData,
    }).then((response: any) => {
        finished.value = true
        newOrder.value = false
        resume.value = { ...response.order, dialog: true }
        snackbarShow(response?.message, 'success')
    }).catch((error) => {
        snackbarShow('Erro ao salvar a venda:' + error, 'error')
    }).finally(() => {
        loading.value = false
    })
}

const loadProducts = async () => {
    const response = await $fetch('/api/product/list')
        .catch(() => {
            snackbarShow('Erro ao buscar vendas', 'error')
        })
    productList.value = response
}

function setNewOrder() {
    customer.value = {}
    orderProduct.value = {}
    paid.value = false
    finished.value = false
    newOrder.value = true
}

function extractNumbers(input: string) {
    return input.replace(/\D/g, '');
}

onMounted(() => {
    loadProducts()
})
</script>