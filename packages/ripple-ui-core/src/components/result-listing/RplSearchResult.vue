<script setup lang="ts">
import { computed } from 'vue'
import RplTextLink from '../text-link/RplTextLink.vue'
import { useAccessibleContainer } from '../../composables/useAccessibleContainer'
import {
  useRippleEvent,
  rplEventPayload
} from '../../composables/useRippleEvent'

interface Props {
  title: string
  url: string
  content?: string
  updated?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: undefined,
  updated: undefined
})

const emit = defineEmits<{
  (e: 'navigate', payload: rplEventPayload & { action: 'click' }): void
}>()

const { emitRplEvent } = useRippleEvent('rpl-search-result', emit)

const { container, trigger } = useAccessibleContainer()

const displayUrl = computed(() => props.url.replace('https://', ''))

const handleClick = () => {
  emitRplEvent(
    'navigate',
    {
      action: 'click',
      value: props?.url,
      text: props.title
    },
    { global: true }
  )
}
</script>

<template>
  <div ref="container" class="rpl-search-result">
    <div v-if="$slots.meta" class="rpl-search-result__meta rpl-type-p-small">
      <slot name="meta"></slot>
    </div>
    <h2 class="rpl-search-result__title rpl-type-h3">
      <RplTextLink ref="trigger" :url="url" @click="handleClick">
        {{ title }}
      </RplTextLink>
    </h2>
    <div
      v-if="url"
      class="rpl-search-result__url rpl-type-p-small rpl-u-screen-only"
    >
      {{ displayUrl }}
    </div>
    <div v-if="$slots.details" class="rpl-search-result__details rpl-type-p">
      <slot name="details"></slot>
    </div>
    <div
      v-if="content"
      class="rpl-search-result__body rpl-type-p"
      v-html="content"
    />
    <p v-if="updated" class="rpl-search-result__body rpl-type-p-small">
      Updated: {{ updated }}
    </p>
  </div>
</template>

<style src="./RplSearchResult.css" />
