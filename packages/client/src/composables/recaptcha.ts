import { onMounted } from 'vue'
import config from '../config'

interface Recaptcha {
  ready: (callback: () => void) => void
  execute: (id?: number) => void
  reset: (id?: number) => void
  render: (
    container: HTMLElement,
    opts: {
      theme: string
      size: string
      sitekey: string
      callback: (code: string) => void
      'error-callback': (err: unknown) => void
    }
  ) => number
}

declare global {
  interface Window {
    grecaptcha?: Recaptcha
  }
}

const loadRecaptchaScript = async (): Promise<Recaptcha> =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.addEventListener('load', () => {
      window.grecaptcha?.ready(() => resolve(window.grecaptcha as Recaptcha))
    })
    script.addEventListener('error', reject)
    document.body.appendChild(script)
  })

const recaptchaQueue: {
  resolve: (code: string) => void
  reject: (err: unknown) => void
}[] = []
let recaptchaPromise: Promise<Recaptcha> | undefined
let recaptchaId: number | undefined
let recaptchaContainer: HTMLElement | undefined

const getRecaptchaContainer = () => {
  if (recaptchaContainer) return recaptchaContainer
  const el = document.createElement('div')
  el.style.display = 'none'
  document.body.appendChild(el)
  recaptchaContainer = el
  return el
}

const handleNext = () => {
  if (!recaptchaQueue.length) return
  void loadRecaptcha().then(r => r.execute(recaptchaId))
}

const handleDone = (code: string) => {
  void loadRecaptcha().then(r => {
    r.reset(recaptchaId)
    recaptchaQueue.shift()?.resolve(code)
    handleNext()
  })
}

const handleError = (err: unknown) => {
  void loadRecaptcha().then(r => {
    r.reset(recaptchaId)
    recaptchaQueue.shift()?.reject(err)
    handleNext()
  })
}

export const loadRecaptcha = async (): Promise<Recaptcha> => {
  recaptchaPromise = recaptchaPromise ?? loadRecaptchaScript()
  const recaptcha = await recaptchaPromise
  recaptchaId =
    recaptchaId ??
    recaptcha.render(getRecaptchaContainer(), {
      theme: 'dark',
      size: 'invisible',
      sitekey:
        (config as unknown as { recaptcha?: { siteKey: string } }).recaptcha
          ?.siteKey ?? '',
      callback: handleDone,
      'error-callback': handleError,
    })
  return recaptcha
}

const requestRecaptchaCode = async () =>
  new Promise<string>((resolve, reject) => {
    recaptchaQueue.push({ resolve, reject })
    handleNext()
  })

export const useRecaptcha = (action: string) => {
  const enabled = (
    config as unknown as { recaptcha?: { protectedActions?: string[] } }
  ).recaptcha?.protectedActions?.includes(action)
  onMounted(() => {
    if (enabled) void loadRecaptcha()
  })
  return enabled ? requestRecaptchaCode : null
}
