<template>
    <v-dialog v-model="editedUser.dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Editar Produto</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field v-model="editedUser.name" label="Nome" :rules="ruleName" />
                    <v-text-field v-model="editedUser.email" label="E-mail" :rules="ruleEmail" />
                    <v-text-field v-model="editedUser.password" label="Senha"
                        :rules="!editedUser.id ? rulePassword : []" type="password" />
                    <v-text-field v-model="editedUser.phone" label="Telefone" v-maska="'(##) 9 ####-####'" />
                    <v-text-field v-model="editedUser.commissionPercent" label="Comissão" type="number" />
                    <v-text-field v-model="editedUser.pix" label="Pix" />
                    <v-select v-model="editedUser.rule" :items="['admin', 'vendedor']" label="Perfil" />
                    <v-switch color="primary" v-model="editedUser.active" label="Ativo" />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" @click="editedUser.dialog = false">Cancelar</v-btn>
                <v-btn color="blue darken-1" @click="save" :disabled="!valid">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
// @ts-ignore
import { vMaska } from "maska/vue"

const editedUser = defineModel() as any;
const valid = ref(false)

// Define the emit function
const emit = defineEmits(['update'])

const ruleName = [(v: string) => {
    return !!v || 'Nome é obrigatório'
}, (v: string) => {
    return v.length >= 3 || 'Nome deve ter no mínimo 3 caracteres'
}]

const ruleEmail = [(v: string) => {
    return /.+@.+\..+/.test(v) || 'E-mail inválido'
}, (v: string) => {
    return !!v || 'E-mail é obrigatório'
}]

const rulePassword = [(v: string) => {
    return !!v || 'Senha é obrigatório'
},
(v: string) => {
    return v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres'
}]

const save = async () => {
    if (valid.value) {
        delete editedUser.value.dialog
        if (!editedUser.value.id) {
            await $fetch('/api/user', {
                // @ts-ignore
                method: 'POST',
                body: editedUser.value
            }).then(() => {
                editedUser.dialog = false
                emit('update', editedUser.value)
            }).catch(() => {
                snackbarShow('Erro ao salvar usuario', 'error')
            })
        } else {
            await $fetch(`/api/user/${editedUser.value.id}`, {
                // @ts-ignore
                method: 'PUT',
                body: editedUser.value
            }).then(() => {
                editedUser.dialog = false
                emit('update', editedUser.value)
            }).catch(() => {
                snackbarShow('Erro ao salvar usuario', 'error')
            })
        }
    }
}
</script>