<template>
  <div class="card">
    <div class="content">
      <p>Team Information</p>
      <p class="font-thin u-no-margin">
        Please enter a separate email for each team member. This data is
        collected for informational purposes only. Ensure that this section
        is up to date in order to remain prize eligible.
      </p>
      <div class="row u-center">
        <AppForm class="col-12 members-form" @submit="handleSubmit" :disabled="buttonDisabled" buttonText="Add Member">
          <div class="form-section">
            <div class="input-control">
              <input
                required
                autocomplete="email"
                autocorrect="off"
                name="email"
                placeholder="Email"
                type="email"
                v-model="email"
                class="input-contains-icon"
              />
              <span class="icon"><EnvelopeOpen /></span>
            </div>
          </div>
        </AppForm>
        <div v-if="members.length" class="row">
          <div v-for="member in members" :key="member.id" class="member-row">
            <p class="u-no-margin">{{ member.email }}</p>
            <div class="btn-container u-vertical-center">
              <input
                @click="handleDelete(member.id)"
                type="submit"
                class="btn-small btn-danger u-no-margin"
                value="Delete"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppForm from '../AppForm.vue'
import EnvelopeOpen from '../../icons/envelope-open.svg'
import { getMembers, addMember, removeMember } from '../../api/members'
import { useToast } from '../../stores/toast'

const { toast } = useToast()
const email = ref('')
const buttonDisabled = ref(false)
const members = ref<any[]>([])

onMounted(async () => { members.value = await getMembers() })

const handleSubmit = async () => {
  buttonDisabled.value = true
  const { error, data } = await addMember({ email: email.value })
  buttonDisabled.value = false
  if (error) { toast({ body: error, type: 'error' }) }
  else { toast({ body: 'Team member successfully added' }); members.value = [...members.value, data]; email.value = '' }
}

const handleDelete = async (id: string) => {
  await removeMember({ id })
  members.value = members.value.filter(m => m.id !== id)
  toast({ body: 'Team member successfully deleted' })
}
</script>

<style scoped>
.members-form :deep(button) {
  display: block;
  margin-left: auto;
  margin-right: 0;
  margin-top: 10px;
}

.member-row {
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
