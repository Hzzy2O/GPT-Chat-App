import { detect } from 'detect-browser'
const browser = detect()

export function recorderPolyfill() {
  // https://community.openai.com/t/whisper-api-cannot-read-files-correctly/93420/13
  if (browser?.name.match(/safari|ios/)?.length) {
    import('audio-recorder-polyfill').then((res) => {
      window.MediaRecorder = res.default
    })
  }
}
