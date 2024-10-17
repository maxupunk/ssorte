<template>
    <v-dialog v-model="editedProduct.dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Editar Produto</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field v-model="editedProduct.name" label="Nome" :rules="[v => !!v || 'Nome é obrigatório']"
                        required></v-text-field>
                    <v-text-field v-model="editedProduct.price" label="Preço" type="number"
                        :rules="[v => !!v || 'Preço é obrigatório']" required></v-text-field>
                    <v-text-field v-model="editedProduct.saleMin" label="Venda Mínima" type="number"></v-text-field>
                    <v-text-field v-model="editedProduct.numberMin" label="Menor numero" type="number"></v-text-field>
                    <v-text-field v-model="editedProduct.numberMax" label="Maior numero" type="number"></v-text-field>
                    <v-text-field v-model="editedProduct.numLottery" label="Número da Loteria"
                        type="number"></v-text-field>
                    <v-switch color="primary" v-model="editedProduct.active" label="Ativo"></v-switch>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" @click="editedProduct.dialog = false">Cancelar</v-btn>
                <v-btn color="blue darken-1" @click="save" :disabled="!valid">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const editedProduct = defineModel() as any;
const valid = ref(false)
const form = ref(null)

// Define the emit function
const emit = defineEmits(['update'])

const save = async () => {
    if (form.value && form.value) {
        delete editedProduct.value.dialog
        console.log(editedProduct.value)
        await $fetch(`/api/product/${editedProduct.value.id}`, {
            // @ts-ignore
            method: 'PUT',
            body: editedProduct.value
        }).then(() => {
            snackbarShow('Produto salvo com sucesso', 'success')
            editedProduct.dialog = false
            emit('update', editedProduct.value)
        }).catch(() => {
            snackbarShow('Erro ao salvar produto', 'error')
        })
    }
}
</script>