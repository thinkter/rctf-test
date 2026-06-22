<template>
  <div class="tab-container tabs-center">
    <ul>
      <li :class="{ selected: route.path === '/' }">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
      </li>
      <template v-if="loggedIn">
        <li :class="{ selected: route.path === '/profile' }">
          <RouterLink to="/profile" class="nav-link">Profile</RouterLink>
        </li>
        <li :class="{ selected: route.path === '/challs' }">
          <RouterLink to="/challs" class="nav-link">Challenges</RouterLink>
        </li>
      </template>
      <template v-else>
        <li v-if="config.registrationsEnabled" :class="{ selected: route.path === '/register' }">
          <RouterLink to="/register" class="nav-link">Register</RouterLink>
        </li>
        <li :class="{ selected: route.path === '/login' }">
          <RouterLink to="/login" class="nav-link">Login</RouterLink>
        </li>
      </template>
      <li :class="{ selected: route.path === '/scores' }">
        <RouterLink to="/scores" class="nav-link">Scoreboard</RouterLink>
      </li>
      <li v-if="loggedIn">
        <LogoutButton class="nav-link" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { loggedIn } from '../stores/auth'
import { useRoute } from 'vue-router'
import config from '../config'
import LogoutButton from './LogoutButton.vue'

const route = useRoute()
</script>

<style scoped>
.nav-link {
  background: transparent !important;
  color: #fff !important;
  padding: 0.5rem 0.7rem !important;
  display: block;
  text-decoration: none;
}

.nav-link:focus {
  box-shadow: none;
  border-bottom-color: rgba(240, 61, 77, 0.6);
}
</style>
