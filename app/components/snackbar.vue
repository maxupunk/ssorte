<template>
    <v-snackbar-queue v-model="UiStore.snackbar" multi-line vertical
        transition="slide-y-reverse-transition"></v-snackbar-queue>
</template>
<script setup lang="ts">
import { useUiStore } from '@/stores/UiStore';
import { defineComponent } from 'vue';
const UiStore = useUiStore()

defineComponent({
    name: 'snackbarQueue',
})
</script>
