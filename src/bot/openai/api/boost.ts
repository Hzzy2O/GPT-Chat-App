import qs from 'qs'

export async function searchWeb(query: string) {
  try {
    const param = {
      query,
      limit: 4,
    }
    const url = 'http://127.0.0.1:8000'
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
