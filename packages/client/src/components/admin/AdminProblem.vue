<template>
  <div class="frame admin-frame">
    <div class="frame__body">
      <form @submit.prevent="handleUpdate" style="margin-top: 1em">
        <div class="frame admin-frame" style="box-shadow: none">
          <div class="frame__body">
            <div class="row u-no-padding">
              <div class="col-6">
                <label>Category</label>
                <input class="form-group-input input-small" placeholder="Category" v-model="category" required />
                <label>Problem Name</label>
                <input class="form-group-input input-small" placeholder="Problem Name" v-model="name" required />
                <label>Author</label>
                <input class="form-group-input input-small" placeholder="Author" v-model="author" required />
              </div>
              <div class="col-6">
                <label>Minimum Points</label>
                <input type="number" class="form-group-input input-small" v-model.number="minPoints" required />
                <label>Maximum Points</label>
                <input type="number" class="form-group-input input-small" v-model.number="maxPoints" required />
                <div class="form-ext-control form-ext-checkbox" style="margin-top: 1em">
                  <input
                    :id="`chall-${problem.id}-tiebreak-eligible`"
                    type="checkbox"
                    class="form-ext-input"
                    v-model="tiebreakEligible"
                  />
                  <label :for="`chall-${problem.id}-tiebreak-eligible`" class="form-ext-label">
                    Eligible for tiebreaks?
                  </label>
                </div>
              </div>
            </div>
            <div class="input-control" style="margin-top: 1em">
              <label>Description</label>
              <textarea placeholder="Describe the problem" v-model="description" required class="form-group-input input-small" />
            </div>
            <div class="input-control">
              <label>Flag</label>
              <input placeholder="Flag" v-model="flag" class="form-group-input input-small" required />
            </div>
            <div style="margin-top: 1em">
              <label>Challenge Files</label>
              <input type="file" multiple @change="handleFileUpload" class="form-group-input input-small" />
              <div v-if="problem.files?.length">
                <p class="frame__subtitle u-no-margin">Existing Files</p>
                <div class="tag-container">
                  <div v-for="file in problem.files" :key="file.url" class="tag admin-tag">
                    <a :download="file.name" :href="file.url">{{ file.name }}</a>
                    <div class="tag tag--delete" @click="handleRemoveFile(file)" />
                  </div>
                </div>
              </div>
            </div>
            <div class="form-section admin-controls" style="margin-top: 1.5em" v-if="hasWritePerm">
              <button type="submit" class="btn-small btn-info">Update Challenge</button>
              <button type="button" class="btn-small btn-danger" @click="deleteModalOpen = true">Delete Challenge</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>

  <AppModal :open="deleteModalOpen" @close="deleteModalOpen = false">
    <div class="modal-header">
      <div class="modal-title">Delete Challenge?</div>
    </div>
    <div class="modal-body">
      This is an irreversible action that permanently deletes the challenge and revokes all solves.
      <div class="admin-controls" style="margin-top: 1rem">
        <div class="btn-container u-inline-block">
          <button type="button" class="btn-small" @click="deleteModalOpen = false">Cancel</button>
        </div>
        <div class="btn-container u-inline-block">
          <button type="submit" class="btn-small btn-danger" @click="handleDelete">Delete Challenge</button>
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppModal from '../AppModal.vue'
import { updateChallenge, deleteChallenge, uploadFiles } from '../../api/admin/challs'
import { hasChallsWritePermission } from '../../util/permissions'
import { encodeFile } from '../../util'
import { useToast } from '../../stores/toast'

const props = defineProps<{ problem: any }>()
const emit = defineEmits<{ update: [{ problem: any }] }>()
const { toast } = useToast()
const hasWritePerm = hasChallsWritePermission()

const flag = ref(props.problem.flag || '')
const description = ref(props.problem.description || '')
const category = ref(props.problem.category || '')
const author = ref(props.problem.author || '')
const name = ref(props.problem.name || '')
const minPoints = ref(props.problem.points?.min ?? 100)
const maxPoints = ref(props.problem.points?.max ?? 500)
const tiebreakEligible = ref(props.problem.tiebreakEligible !== false)
const deleteModalOpen = ref(false)

const handleUpdate = async () => {
  if (!hasChallsWritePermission()) {
    toast({ body: 'You do not have permission to update challenges', type: 'error' })
    return
  }
  const data = await updateChallenge({
    id: props.problem.id,
    data: { flag: flag.value, description: description.value, category: category.value, author: author.value, name: name.value, tiebreakEligible: tiebreakEligible.value, points: { min: minPoints.value, max: maxPoints.value } },
  })
  emit('update', { problem: data })
  toast({ body: 'Problem successfully updated' })
}

const handleFileUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const fileData = await Promise.all(Array.from(input.files).map(async f => ({ data: await encodeFile(f), name: f.name })))
  const fileUpload = await uploadFiles({ files: fileData })
  if (fileUpload.error) { toast({ body: fileUpload.error, type: 'error' }); return }
  const data = await updateChallenge({ id: props.problem.id, data: { files: fileUpload.data.concat(props.problem.files) } })
  input.value = ''
  emit('update', { problem: data })
  toast({ body: 'Problem successfully updated' })
}

const handleRemoveFile = async (file: any) => {
  const newFiles = props.problem.files.filter((f: any) => f !== file)
  const data = await updateChallenge({ id: props.problem.id, data: { files: newFiles } })
  emit('update', { problem: data })
  toast({ body: 'Problem successfully updated' })
}

const handleDelete = async () => {
  await deleteChallenge({ id: props.problem.id })
  toast({ body: `${props.problem.name} successfully deleted`, type: 'success' })
  deleteModalOpen.value = false
}
</script>

<style scoped>
.admin-frame {
  margin-bottom: 1em;
  padding-bottom: 0.625em;
  background: #222;
}

.admin-frame :deep(input),
.admin-frame :deep(textarea) {
  color: #fff !important;
  background: #111;
}

.admin-tag {
  background: #111;
}

.admin-controls {
  display: flex;
  justify-content: space-between;
}
</style>
