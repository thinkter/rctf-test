<template>
  <div class="row">
    <div v-for="sponsor in sponsors" :key="sponsor.name" class="col-6 sponsor-row">
      <div class="card sponsor-card" :class="{ 'u-flex u-flex-column h-100': !sponsor.small }">
        <div class="content">
          <figure v-if="sponsor.icon" class="u-center sponsor-icon">
            <img :src="sponsor.icon" />
          </figure>
          <p class="title level">{{ sponsor.name }}</p>
          <small class="sponsor-description">
            <AppMarkdown :content="sponsor.description || ''" :external-links="externalLinks" />
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import config from '../config'
import AppMarkdown from './AppMarkdown.vue'

interface Sponsor {
  name: string
  icon?: string
  description?: string
  small?: boolean
}

defineProps<{ externalLinks?: boolean }>()

const sponsors = computed(() => ((config as { sponsors?: Sponsor[] }).sponsors || []))
</script>

<style scoped>
.sponsor-icon {
  padding: 10px;
  margin: 20px 0;
  background: #fff;
  border-radius: 10px;
}

.sponsor-icon img {
  height: 6.25em;
  width: auto;
}

.sponsor-description :deep(a) {
  display: inline;
  padding: 0;
}

.sponsor-row {
  margin-bottom: 1.5em;
}

.sponsor-card {
  background: #222;
}
</style>
