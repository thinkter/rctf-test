<template>
  <div class="app-root">
    <AppHeader />
    <div class="content-wrapper">
      <RouterView />
    </div>
    <AppFooter />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>

<style>
.app-root {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #111;
  color: #fff;
}

.content-wrapper {
  flex: 1 0 auto;
  padding: 1rem 0;
}
</style>
