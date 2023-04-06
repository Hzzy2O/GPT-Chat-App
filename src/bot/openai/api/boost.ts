import qs from 'qs'

export async function searchWeb(query: string) {
  try {
    const param = {
      query,
      limit: 4,
    }
    const url = 'https://chatdemo-1-v5858982.deta.app'
    const { data } = await useFetch(`${url}/search?${qs.stringify(param)}`).json()
    const { code, data: res } = data.value
    if (code !== 200)
      return query
    return res
  }
  catch (error) {
    return query
  }
}
