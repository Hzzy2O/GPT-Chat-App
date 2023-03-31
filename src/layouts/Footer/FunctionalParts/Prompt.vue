<script lang="ts" setup>
import { isString } from 'markdown-it/lib/common/utils'
import { useRecordStore } from '@/store'
import { pldb } from '@/utils/IDB/pldb'

const { error } = useMessage()

const recordStore = useRecordStore()
const { setPrompt } = recordStore
const { prompt } = storeToRefs(recordStore)

const { textarea, input } = useTextareaAutosize()

// 选择设定词内容， 用于跟踪是否有修改
const promptContent = ref('')

const selectPrompt = ref('')

const filterKey = ref('all')
watch(filterKey, () => {
  if (filterKey.value === 'all')
    return
  selectPrompt.value = ''
  promptContent.value = ''
  input.value = ''
})
// 设定词列表
const options = ref<LabelValueOptions>([])
const displayOptions = computed(() => {
  if (filterKey.value === 'all')
    return options.value
  return options.value.filter(item => item.lang === filterKey.value)
})
// 过滤设定语言
const promptTitle = computed(() => {
  const title = options.value.find(item => item.content === prompt.value)?.label
  return isString(title) ? title : ''
})

// 获取设定词列表
async function setOptions() {
  const ls = await pldb.getAll()

  if (ls) {
    options.value = ls.map((item) => {
      return {
        label: item.title,
        value: item.title,
        lang: item.lang,
        content: item.content,
      }
    })
  }
}
setOptions()

// 获取设定词内容
async function getContent(title: string) {
  const ctt = await pldb.query({ title })
  if (ctt)
    promptContent.value = ctt[0]?.content
  input.value = promptContent.value
}

const showModal = ref(false)

// 是否进入新增设定词模式
const createMode = ref(false)
const filterOptions = computed(() => {
  const all = { label: t('common.all'), value: 'all' }
  const ext = [
    {
      label: t('common.en'),
      value: 'en',
    },
    {
      label: t('common.zh'),
      value: 'zh',
    },
  ]
  return createMode.value ? ext : [all, ...ext]
})

// 是否有修改
const hasChange = computed(() => input.value !== promptContent.value)

// 新增设定词标题
const newPrompt = ref('')

// 进入新增设定词模式
function intoCreateMode() {
  newPrompt.value = promptTitle.value || ''
  filterKey.value = 'en'
  createMode.value = true
}
// 返回选择设定词
function backToChoose() {
  createMode.value = false
  input.value = promptContent.value
}

// 保存加载中
const saveLoading = ref(false)

// 保存设定词
async function save() {
  if (createMode.value) {
    // 判断标题是否重复
    const transform = (str: string) => str.replace(/\s/g, '').toLowerCase()
    const isExist = options.value.find(
      item => transform(item.label) === transform(newPrompt.value),
    )
    if (isExist) {
      error(t('footer.prompt.duplicate'))
      return
    }

    saveLoading.value = true
    await pldb.add({
      title: newPrompt.value,
      content: input.value,
      lang: 'en',
    })
    promptContent.value = input.value
    selectPrompt.value = newPrompt.value
    await setOptions()
    createMode.value = false
    saveLoading.value = false
  }
}

// 编辑设定词
async function edit() {
  if (selectPrompt.value) {
    saveLoading.value = true
    await pldb.update(selectPrompt.value, { content: input.value })
    promptContent.value = input.value

    // 更新设定词列表
    setOptions()
    saveLoading.value = false
  }
}

// 撤销更改
function revoke() {
  if (createMode.value) {
    // 新增模式则晴空
    input.value = ''
  }
  else {
    input.value = promptContent.value
  }
}

// 删除设定词
async function deletePrompt() {
  if (selectPrompt.value) {
    await pldb.delete(selectPrompt.value)
    setOptions()
    selectPrompt.value = ''
    promptContent.value = ''
    input.value = ''
  }
}

function confirm() {
  setPrompt(promptContent.value)
  showModal.value = false
}

// 清空所有数据
function clearAll() {
  selectPrompt.value = ''
  promptContent.value = ''
  input.value = ''
  newPrompt.value = ''
  createMode.value = false
}

defineExpose({
  open() {
    showModal.value = true
  },
})
</script>

<template>
  <div v-if="prompt" absolute bottom--30px fc class="container">
    <Icon name="line-md:chevron-small-right" cursor-default :size="23" />
    <n-popover trigger="hover" :width="300">
      <template #trigger>
        <div mr-10px ml-5px cursor-default w-full truncate>
          {{ promptTitle }}
        </div>
      </template>
      <div max-300px>
        {{ prompt }}
      </div>
    </n-popover>
    <Icon
      name="line-md:close"
      color-rose-5
      :title="t('common.delete')"
      :size="14"
      @click="setPrompt('')"
    />
  </div>
  <NModal
    v-model:show="showModal"
    card-modal
    class="custom-prompt-modal"
    preset="card"
    :title="t('footer.prompt.title')"
    size="huge"
    :bordered="false"
    :show-selected="false"
    @after-leave="clearAll"
  >
    <div fc flex-col>
      <div mb-10px flex flex-start w-full>
        <!-- 新建按钮 -->
        <NButton v-if="!createMode" dashed @click="intoCreateMode">
          {{
            t('footer.prompt.create')
          }}
        </NButton>
        <NButton v-else dashed @click="backToChoose">
          {{ t('footer.prompt.backToChoose') }}
        </NButton>
      </div>
      <div fic w-full>
        <!-- 选择器 -->
        <NSelect
          v-if="!createMode"
          v-model:value="selectPrompt"
          filterable
          rd-12px
          :options="displayOptions"
          @update-value="getContent"
        />
        <!-- 标题输入框 -->
        <NInput
          v-else
          v-model:value="newPrompt"
          rd-8px
          :placeholder="t('footer.prompt.titlePlaceholder')"
        />
        <!-- 语言选择 -->
        <NPopselect v-model:value="filterKey" :options="filterOptions">
          <NButton text ml-10px>
            {{ t(`common.${filterKey}`) }}
          </NButton>
        </NPopselect>
      </div>
      <div w-full border="1px solid truegray-2 dark:truegray-6" rd-12px mt-10px px-10px pb-5px>
        <!-- 内容输入框 -->
        <textarea
          ref="textarea"
          v-model="input"
          mt-5px
          w-full
          min-h-200px
          max-h-200px
          scrollbar="~ rounded track-color-transparent dark:thumb-color-zinc-4"
          :placeholder="t('footer.prompt.contentPlaceholder')"
          type="textarea"
        />
        <div h-23px flex justify-end w-full>
          <!-- 删除按钮 -->
          <n-popconfirm
            v-if="!createMode"
            :negative-text="t('common.cancel')"
            :positive-text="t('common.confirm')"
            :show-icon="false"
            @positive-click="deletePrompt"
          >
            <template #trigger>
              <Icon
                :title="t('common.delete')"
                name="material-symbols:delete-forever-outline"
                color-rose-5
                :size="23"
              />
            </template>
            {{ t('common.deleteConfirm') }}
          </n-popconfirm>
          <template v-if="input && !saveLoading">
            <!-- 撤销按钮 -->
            <Icon
              v-if="createMode || hasChange"
              animate-fade-in
              :size="23"
              name="line-md:rotate-180"
              color-red-5
              mr-10px
              :title="t('footer.prompt.revoke')"
              @click="revoke"
            />
            <!-- 修改按钮 -->
            <Icon
              v-if="!saveLoading && !createMode && hasChange"
              animate-fade-in
              :size="23"
              name="line-md:confirm"
              color-green-5
              :title="t('footer.prompt.save')"
              @click="edit"
            />
          </template>
          <Icon v-if="saveLoading" :size="23" name="svg-spinners:ring-resize" />
        </div>
      </div>
    </div>
    <template #footer>
      <div fic justify-end h-62px>
        <template v-if="input">
          <NButton v-if="!createMode" round strong secondary type="success" @click="confirm">
            {{
              t('footer.prompt.confirm')
            }}
          </NButton>
          <NButton
            v-else-if="!saveLoading && newPrompt && input"
            round
            strong
            secondary
            type="success"
            @click="save"
          >
            {{ t('footer.prompt.save') }}
          </NButton>
        </template>
      </div>
    </template>
  </NModal>
</template>

<style lang="scss">
  .custom-prompt-modal {
    .n-card-header {
      padding: 20px 30px !important;
    }
    .n-base-selection {
      border-radius: 8px;
    }
  }
</style>
