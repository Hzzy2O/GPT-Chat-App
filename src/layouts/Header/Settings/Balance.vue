<script setup lang="ts">
const fetching = ref(false)

// 获取是否实现了余额功能
const balanceFunc = computed(() => bot.value.getBalance)
watch([balanceFunc, () => bot.value.apiKey.value], ([balance, apikey]) => {
  if (balance && apikey)
    getBalanceMsg()
}, { immediate: true })

const balanceInfo = reactive({
  total: 0,
  used: 0,
  available: 0,
})

async function getBalanceMsg() {
  fetching.value = true
  try {
    const balance = await bot.value.getBalance?.()
    if (balance) {
      balanceInfo.total = balance.total
      balanceInfo.used = balance.used
      balanceInfo.available = balance.available
    }
  }
  catch (error) {
  }
  finally {
    fetching.value = false
  }
}
</script>

<template>
  <template v-if="balanceFunc">
    <div v-if="balanceInfo.total" mb-15px flex flex-gap-7px flex-wrap text-13px>
      <span>{{ t('siderbar.total') }}: {{ balanceInfo.total }} </span>
      <span>{{ t('siderbar.used') }}: {{ balanceInfo.used }} </span>
      <span>{{ t('siderbar.available') }}: {{ balanceInfo.available }} </span>
      <Icon v-if="fetching" name="svg-spinners:eclipse-half" :size="12" />
      <Icon v-else name="line-md:rotate-270" :size="15" @click="getBalanceMsg" />
    </div>
  </template>
</template>
