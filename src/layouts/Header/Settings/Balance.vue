<script setup lang="ts">
// 余额展示
const balance = computed(() => bot.value.getBalance)
watch(balance, () => {
  getBalanceMsg()
}, { immediate: true })

const balanceInfo = reactive({
  total: 0,
  used: 0,
  available: 0,
})
const balanceMsg = computed(() => `<div flex flex-gap-7px flex-wrap text-14px>
  <span>${t('siderbar.total')}: ${balanceInfo.total}$ </span>
  <span>${t('siderbar.used')}: ${balanceInfo.used}$ </span>
  <span>${t('siderbar.available')}: ${balanceInfo.available}$ </span>
</div>`)
async function getBalanceMsg() {
  const balance = await bot.value.getBalance?.()
  if (balance) {
    balanceInfo.total = balance.total
    balanceInfo.used = balance.used
    balanceInfo.available = balance.available
  }
}

// const balanceMsg = computed(() => balance.value?.().balanceMsg)
</script>

<template>
  <template v-if="balance">
    <div mb-15px v-html="balanceMsg" />
  </template>
</template>
