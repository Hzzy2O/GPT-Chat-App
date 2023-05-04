<script setup lang="ts">
import type { DropdownOption, TreeOption } from 'naive-ui'
import type { AutoGPTModel } from '../..'
import { getFileInfo } from '@/bot/autogpt/api'
import { useAutoGPTStore } from '@/store'

const autogptStore = useAutoGPTStore()
const { curBotId } = storeToRefs(autogptStore)

const treeData = ref<TreeOption[]>([])

async function getInfo() {
  const { data } = await getFileInfo({
    gpt_id: curBotId.value,
  })
  if (data.value)
    treeData.value = data.value
}

const showDropdown = ref(false)
const options = computed<DropdownOption[]>(() => ([
  {
    label: t('autogpt.download'),
    value: 'download',
  },
]))
const x = ref(0)
const y = ref(0)

const selectNode = ref<TreeOption>()

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onContextmenu(e: MouseEvent): void {
      selectNode.value = option
      showDropdown.value = true
      x.value = e.clientX
      y.value = e.clientY
      e.preventDefault()
    },
  }
}

async function download(path: string, name: string) {
  const autogpt = bot.value as AutoGPTModel
  await autogpt.download(path, name)
}
function downloadAll() {
  download('', 'compressed-files.zip')
}

function handleSelect() {
  const { path, name, type } = selectNode.value as any
  download(path, type === 'file' ? name : `${name}.zip`)
  showDropdown.value = false
}
function handleClickoutside() {
  showDropdown.value = false
}

const showModal = ref(false)
const toggleModal = (show: boolean) => {
  if (show)
    getInfo()
  showModal.value = show
}

defineExpose({
  open: () => toggleModal(true),
})
</script>

<template>
  <NModal
    :show="showModal"
    preset="dialog"
    rd-10px
    :show-icon="false"
    :title="t('autogpt.file_manage')"
    :positive-text="t('autogpt.download_all')"
    @update-show="toggleModal"
    @positive-click="downloadAll"
  >
    <NTree
      block-line
      :data="treeData"
      key-field="path"
      label-field="name"
      children-field="children"
      :node-props="nodeProps"
      virtual-scroll
      :selectable="false"
      style="height: 320px"
    />
    <NDropdown
      trigger="manual"
      placement="bottom-start"
      :show="showDropdown"
      :options="options"
      :x="x"
      :y="y"
      @select="handleSelect"
      @clickoutside="handleClickoutside"
    />
  </NModal>
</template>
