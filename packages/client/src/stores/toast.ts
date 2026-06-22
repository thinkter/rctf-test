import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ToastData {
  id: number
  type?: string
  body: string
}

let toastIdCounter = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastData[]>([])

  const remove = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const add = (data: Omit<ToastData, 'id'>) => {
    const id = toastIdCounter++
    toasts.value.push({ ...data, id })
    return () => remove(id)
  }

  return { toasts, add, remove }
})

export const useToast = () => {
  const store = useToastStore()
  return { toast: store.add }
}
