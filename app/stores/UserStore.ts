import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {} as any,
        users: [] as any[],
    }),

    actions: {
        async fetchUsers() {
            return await $fetch("/api/users/").then((response: any) => {
                this.users = response.users
            })
        },
        async fetchUser(id: number) {
            return await $fetch("/api/users/" + id).then((response: any) => {
                this.user = response.user
            })
        },
        async createUser(data: any) {
            const response = await $fetch("/api/users/", {
                method: 'POST',
                body: JSON.stringify(data)
            })
            return response
        },
        async updateUser(id: string, data: any) {
            return await $fetch("/api/users/" + id, {
                method: 'PUT',
                body: JSON.stringify(data)
            })
        },
    },
})
