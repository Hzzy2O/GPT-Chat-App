function _streamAsyncIterator(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader()

  return {
    next() {
      return reader.read()
    },
    return() {
      reader.releaseLock()
      return {}
    },
    [Symbol.asyncIterator]() {
      return this
    },
  }
}

export type ReadStreamFunc = (stream: string, controller?: ReadableStreamDefaultController) => void

export function parseStream(body: ReadableStream<Uint8Array>, readStream: ReadStreamFunc) {
  const decoder = new TextDecoder()

  async function start(controller: ReadableStreamDefaultController) {
    // const parse = myparse(readStream, controller);
    for await (const chunk of _streamAsyncIterator(body) as any) {
      const str = decoder.decode(chunk)

      readStream(str, controller)
    }
  }
  const stream = new ReadableStream({
    start,
  })
  return new Response(stream)
}
