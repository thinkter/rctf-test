import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import { loadConfig } from './config'
import App from './App.vue'
import './style.css'

void (async () => {
  await loadConfig()
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
})()
