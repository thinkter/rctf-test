import { router } from './router'

export const route = (path: string, replace = false) => {
  if (replace) {
    void router.replace(path)
  } else {
    void router.push(path)
  }
}
