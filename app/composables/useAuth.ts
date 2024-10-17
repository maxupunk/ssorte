import { useCookie } from '#app'

const token = useCookie('token')

function setToken(newToken: string) {
    token.value = newToken
}

function getToken() {
    if (!token.value) {
        return null
    }
    return token.value
}

function removeToken() {
    token.value = null
}

function setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user))
}

function getUser() {
    const user = localStorage.getItem('user')
    if (user && user !== 'undefined') {
        return JSON.parse(user)
    }
    return {}
}

function removeUser() {
    localStorage.removeItem('user')
}

export {
    setToken,
    getToken,
    removeToken,
    setUser,
    getUser,
    removeUser
}