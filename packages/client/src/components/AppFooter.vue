<template>
  <div class="app-footer">
    <span>
      Powered by
      <a href="https://rctf.redpwn.net/" target="_blank" rel="noopener noreferrer">rCTF</a>
    </span>
  </div>
</template>

<style scoped>
.app-footer {
  display: flex;
  justify-content: center;
  padding: 1rem;
  font-size: 0.85rem;
  opacity: 0.7;
  transition: opacity 300ms ease;
}

.app-footer:hover {
  opacity: 1;
}

.app-footer a {
  display: inline;
  padding: 0;
}
</style>
