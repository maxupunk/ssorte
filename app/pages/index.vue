<template>
    <appBar title="Home" />
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" md="8">
                <v-sheet elevation="2" class="pa-8 text-center">
                    <v-icon size="64" color="primary">mdi-account-circle</v-icon>
                    <h1 class="display-1">Bem-vindo(a)!</h1>
                    <p class="subtitle-1">Esta é a tela de boas-vindas</p>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import appBar from '~/components/appBar.vue'
</script>
