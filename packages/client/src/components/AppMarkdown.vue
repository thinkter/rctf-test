<template>
  <div ref="root" class="markup" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed, createApp, defineAsyncComponent, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { App, Component } from 'vue'
import snarkdown from 'snarkdown'
import AppTimer from './AppTimer.vue'
import ActionButton from './ActionButton.vue'

const props = withDefaults(defineProps<{ content: string; externalLinks?: boolean }>(), {
  externalLinks: false,
})

const snarkdownEnhanced = (md: string): string => {
  const htmls = md
    .split(/(?:\r?\n){2,}/)
    .map(l =>
      [' ', '\t', '#', '-', '*'].some(ch => l.startsWith(ch))
        ? snarkdown(l)
        : `<p>${snarkdown(l)}</p>`
    )
  return htmls.join('\n\n')
}

const html = computed(() => snarkdownEnhanced(props.content || ''))

const Sponsors = defineAsyncComponent(() => import('./Sponsors.vue'))
const root = ref<HTMLElement | null>(null)
let mountedApps: App[] = []

const unmountCustomComponents = () => {
  for (const app of mountedApps) app.unmount()
  mountedApps = []
}

const copyAttributes = (el: Element): Record<string, string> => {
  const attrs: Record<string, string> = {}
  for (const attr of Array.from(el.attributes)) attrs[attr.name] = attr.value
  return attrs
}

const forceLinksExternal = (el: ParentNode) => {
  if (!props.externalLinks) return

  for (const link of Array.from(el.querySelectorAll('a'))) {
    link.target = '_blank'
    link.rel = link.rel.split(/\s+/).includes('noopener') ? link.rel : `${link.rel} noopener`.trim()
  }
}

const mountCustomComponent = (el: Element, component: Component, extraProps: Record<string, unknown> = {}) => {
  const host = document.createElement('div')
  const parent = el.parentElement
  const target = parent?.tagName === 'P' && Array.from(parent.childNodes).every(node =>
    node === el || (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() === '')
  ) ? parent : el
  target.replaceWith(host)

  const app = createApp(component, { ...copyAttributes(el), ...extraProps })
  app.mount(host)
  mountedApps.push(app)
  forceLinksExternal(host)
}

const mountCustomComponents = async () => {
  unmountCustomComponents()
  await nextTick()

  if (!root.value) return

  for (const el of Array.from(root.value.querySelectorAll('timer'))) {
    mountCustomComponent(el, AppTimer)
  }

  for (const el of Array.from(root.value.querySelectorAll('sponsors'))) {
    mountCustomComponent(el, Sponsors, { externalLinks: props.externalLinks })
  }

  for (const el of Array.from(root.value.querySelectorAll('action-button, actionbutton'))) {
    mountCustomComponent(el, ActionButton, {
      html: el.innerHTML,
      externalLinks: props.externalLinks,
    })
  }

  forceLinksExternal(root.value)
}

watch(html, mountCustomComponents, { immediate: true })
watch(() => props.externalLinks, () => { if (root.value) forceLinksExternal(root.value) })
onBeforeUnmount(unmountCustomComponents)
</script>
