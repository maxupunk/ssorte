<template>
    <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
        <v-card width="600">
            <v-form @submit.prevent="login" ref="form">
                <v-card-title class="justify-center">Login</v-card-title>
                <v-card-text>
                    <v-text-field v-model="email" label="Email" type="email" required outlined
                        prepend-icon="mdi-email"></v-text-field>
                    <v-text-field v-model="password" label="Password" type="password" required outlined
                        prepend-icon="mdi-lock"></v-text-field>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn :loading="loading" type="submit" color="primary">Login</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { snackbarShow } from "~/composables/useUi"

const useAuth = useAuthStore()

const email = ref()
const password = ref()
const loading = ref(false)

defineComponent({
    name: 'login',
})

async function login() {
    await useAuth.login(email.value, password.value).then(response => {
        console.log("login", response)
        snackbarShow('Login efetuado com sucesso', 'success')
        // router.push('/')
    }).catch(error => {
        snackbarShow(error.data.message, 'error')
    })
}
</script>