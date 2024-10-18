<template>
  <v-app>{{ token }}
    <NuxtLayout v-if="token">
      <NuxtPage />
    </NuxtLayout>
    <login v-else />
    <snackbar />
  </v-app>
</template>
<script lang="ts" setup>
import snackbar from '~/components/snackbar.vue';
import { defineComponent } from 'vue';
import { useAuthStore } from '~/stores/auth';
import login from '~/components/login.vue';

const useAuth = useAuthStore();
const { token } = storeToRefs(useAuth)

defineComponent({
  components: {
    snackbar,
  },
});
</script>
