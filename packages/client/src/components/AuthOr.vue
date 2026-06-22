<template>
  <div class="col-12">
    <div class="auth-or-row">
      <h6>or</h6>
    </div>
  </div>
</template>

<style scoped>
.auth-or-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 15px auto;
  max-width: 500px;
}

.auth-or-row::before,
.auth-or-row::after {
  display: block;
  content: '';
  flex: 1 0 0;
  height: 0;
  border-top: 1px solid #333;
}

.auth-or-row h6 {
  margin-left: var(--gap-4);
  margin-right: var(--gap-4);
  font-variant: small-caps;
  font-size: 1rem;
}
</style>
