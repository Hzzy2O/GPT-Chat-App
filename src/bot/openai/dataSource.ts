const models = useFetch<{ data: Record<string, any>[] }>(
  'https://gist.githubusercontent.com/0xoopi/6ab2dfe6e59033f0ea0af6618eecca6e/raw/0a41e269af57aa32d4deb7be5c692c8e297418e7/chatModel.json',
).json()

export const modelList = computed(() =>
  models.data.value?.map((item: any) => ({
    label: item.name,
    value: item.name,
    ...item,
  })),
)
