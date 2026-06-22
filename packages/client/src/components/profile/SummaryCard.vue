<template>
  <div class="card">
    <div class="content">
      <div class="summary-wrapper">
        <h5 class="title" :class="isPrivate ? 'private-header' : 'public-header'" :title="name">{{ name }}</h5>
        <a
          v-if="ctftimeId"
          :href="`https://ctftime.org/team/${ctftimeId}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Ctftime style="height: 20px;" />
        </a>
      </div>
      <div class="action-bar">
        <p>
          <span class="icon icon-item"><Trophy /></span>
          {{ score === 0 ? 'No points earned' : `${score} total points` }}
        </p>
        <p>
          <span class="icon icon-item"><Rank /></span>
          {{ score === 0 ? 'Unranked' : `${divisionPlace} in the ${division} division` }}
        </p>
        <p>
          <span class="icon icon-item"><Rank /></span>
          {{ score === 0 ? 'Unranked' : `${globalPlace} across all teams` }}
        </p>
        <p>
          <span class="icon icon-item"><AddressBook /></span>
          {{ division }} division
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Trophy from '../../icons/trophy.svg'
import Rank from '../../icons/rank.svg'
import AddressBook from '../../icons/address-book.svg'
import Ctftime from '../../icons/ctftime.svg'

defineProps<{
  name: string
  score: number
  division: string
  divisionPlace: string
  globalPlace: string
  ctftimeId?: string
  isPrivate: boolean
}>()
</script>

<style scoped>
.summary-wrapper {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  padding-bottom: 5px;
}

.icon-item :deep(svg) {
  vertical-align: middle;
  height: 1.25em;
  fill: #333;
}

.icon-item {
  margin-right: 1.5em;
}

.public-header {
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0 !important;
  max-width: 75vw;
}

.private-header {
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0 !important;
  max-width: 30vw;
}

@media (max-width: 804px) {
  .private-header { max-width: 75vw; }
}
</style>
