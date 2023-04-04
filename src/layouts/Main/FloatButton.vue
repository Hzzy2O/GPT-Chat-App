<script setup lang="ts">
function updateColor(color: string) {
  themeColor.value = color
}
</script>

<template>
  <NPopover
    trigger="click"
    w-205px
  >
    <template #trigger>
      <NButton
        absolute
        right-20px
        bottom-10px
        shadow
        z-99
        type="default"
        icon="plus"
        size="large"
        circle
        class="float-button"
      >
        <Icon name="solar:settings-minimalistic-broken" :size="28" />
      </NButton>
    </template>
    <NScrollbar max-h-60vh w-full>
      <NFormItem :label="t('common.themeColor')">
        <NColorPicker :value="themeColor" @update-value="updateColor" />
      </NFormItem>
    </NScrollbar>
  </NPopover>
</template>
