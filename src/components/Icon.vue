<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    size?: number
    color?: string
    title?: string
  }>(),
  {
    size: 33,
    title: '',
  },
)
</script>

<template>
  <label :title="title ? t(title) : ''" fc display-inherit cursor-pointer>
    <NIcon :size="size" :color="color">
      <iconify-icon v-if="!name.startsWith('#svg-')" :width="size" :height="size" :icon="name" />
      <svg
        v-else
        class="svg-icon-spin" :class="[$attrs.class]"
        :style="`width:${size}px;height:${size}px;`"
        aria-hidden="true"
      >
        <use :xlink:href="name" :fill="color" />
      </svg>
    </NIcon>
  </label>
</template>

<style lang="scss" scoped>
  .svg-icon-spin {
    display: inline-block;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
  }
</style>
