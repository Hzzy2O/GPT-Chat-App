<script lang="ts" setup>
defineEmits(['play'])
</script>

<template>
  <div animate-fade-in fic justify-end>
    <NPopover trigger="hover" class="!p-0 !rd-10px">
      <template #trigger>
        <NButton text>
          <Icon name="solar:menu-dots-bold" transition-all :size="18" />
        </NButton>
      </template>
      <NList hoverable p-5px rd-10px>
        <NListItem class="!p-4px !rd-8px" cursor-pointer>
          <div fc @click="$emit('play')">
            <Icon name="material-symbols:play-arrow-rounded" :size="18" />
            speech
          </div>
        </NListItem>
      </NList>
    </NPopover>
  </div>
</template>
