import { useUiStore } from '~/stores/UiStore'
export function snackbarShow(text: string, color?: string, timeout?: number) {
    const uiStore = useUiStore()
    uiStore.showSnackbar(text, color, timeout)
}