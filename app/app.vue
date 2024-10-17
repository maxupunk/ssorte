<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <snackbar />
  </v-app>
</template>
<script lang="ts" setup>
import snackbar from '~/components/snackbar.vue';
import { defineComponent } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router'
const router = useRouter()

const { user, token } = useAuthStore();

watchEffect(() => {
  if (!token) {
    router.push('/login');
  }
});

defineComponent({
  components: {
    snackbar,
  },
});
</script>
