<template>
    <appBar title="Home">
        <v-btn icon="mdi-magnify" variant="text"></v-btn>
    </appBar>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" md="8">
                <v-sheet elevation="2" class="pa-8 text-center">
                    <h1 class="display-1">Config</h1>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import appBar from '~/components/appBar.vue'

defineComponent({
    name: 'ProductsList',
    components: {
        appBar
    }
})
</script>
