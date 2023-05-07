<script setup lang="ts">
const showModal = ref(false)
const toggleModal = (show: boolean) => {
  showModal.value = show
}

defineExpose({
  openModal: () => toggleModal(true),
})
</script>

<template>
  <NModal
    :show="showModal"
    preset="dialog"
    rd-10px
    :show-icon="false"
    :title="t('footer.mode.editImg')"
    @update-show="toggleModal"
  >
    <div fic justify-start flex-gap-40px>
      插件市场
    </div>
  </NModal>
</template>
