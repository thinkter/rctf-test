<template>
  <form :class="props.class" @submit.prevent="$emit('submit', $event)">
    <slot />
    <button
      :disabled="disabled"
      class="submit-btn btn-info u-center"
      name="btn"
      value="submit"
      type="submit"
    >
      {{ buttonText }}
    </button>
    <span class="fg-danger info" />
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string
  disabled?: boolean
  buttonText?: string
}>()
defineEmits<{ submit: [e: Event] }>()
</script>

<style scoped>
.submit-btn {
  margin-top: 25px;
  width: 100%;
  display: block;
}
</style>
