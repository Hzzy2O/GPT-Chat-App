const models = useFetch<{ data: Record<string, any>[] }>(
  'https://gist.githubusercontent.com/0xoopi/6ab2dfe6e59033f0ea0af6618eecca6e/raw/c27c2548b999be8f75428ca3fbab88f211825007/chatModel.json',
).json()

export const modelList = computed(() =>
  models.data.value?.map((item: any) => ({
    label: item.name,
    value: item.name,
    ...item,
  })),
)
