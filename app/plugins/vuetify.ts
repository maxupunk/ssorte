// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VSnackbarQueue } from 'vuetify/labs/VSnackbarQueue'
import { VNumberInput } from 'vuetify/labs/VNumberInput'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      VSnackbarQueue,
      VNumberInput,
    },
  })
  app.vueApp.use(vuetify)
})