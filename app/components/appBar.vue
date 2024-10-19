<template>
  <v-app-bar scroll-behavior="hide">
    <v-app-bar-nav-icon @click="drawer = !drawer" v-if="token"></v-app-bar-nav-icon>
    <v-app-bar-title>
      {{ props.title }}
    </v-app-bar-title>
    <v-progress-linear :active="loading" :indeterminate="loading" color="primary" absolute bottom />
    <v-spacer></v-spacer>
    <slot></slot>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" v-if="token">
    <template v-slot:prepend>
      <v-list item-props>
        <v-list-item lines="two" prepend-icon="mdi-account" :subtitle="user.name" :title="user.email" />
      </v-list>
    </template>

    <v-divider></v-divider>
    <v-list nav>
      <v-list-item link prepend-icon="mdi-home" title="Home" to="/" />
      <v-list-subheader>Gerencia</v-list-subheader>
      <v-list-item link prepend-icon="mdi-clipboard-text" title="Vendas" to="/venda" />
      <v-list-item v-if="user.rule == 'admin'" link prepend-icon="mdi-store" title="Produtos" to="/produto" />
      <v-list-item v-if="user.rule == 'admin'" link prepend-icon="mdi-account" title="Usuario" to="/user" />

      <v-list-subheader v-if="user.rule == 'admin'">Ferramentar</v-list-subheader>
      <v-list-item link prepend-icon="mdi-clover" title="Sorteio" to="/sorte" v-if="user.rule == 'admin'" />
      <v-list-item link prepend-icon="mdi-cog-outline" title="Configurações" to="/config" v-if="user.rule == 'admin'" />
    </v-list>
    <template v-slot:append>
      <v-btn block color="warning" @click="logout()">
        Logout
      </v-btn>
    </template>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

const useAuth = useAuthStore()
const { token, user } = storeToRefs(useAuth)

const props = defineProps<Props>();

interface Props {
  title?: string
  loading?: boolean
}

const drawer = ref(false)

function logout() {
  useAuth.logout().then(() => {
    snackbarShow('Logout efetuado com sucesso', 'success')
  })
}

</script>
