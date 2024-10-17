import { defineStore } from 'pinia'

export const useUiStore = defineStore('Ui', {
    state: () => ({
        snackbar: [] as { text: string, color: string, timeout: number }[],
        log: [] as {}[],
    }),
    actions: {
        showSnackbar(message: string, color: string = '', timeout: number = 1500) {
            if (color === 'error') timeout = 4000
            this.snackbar.push({ text: message, color: color, timeout: timeout })
            this.log.push({ message })
        },
    },
})