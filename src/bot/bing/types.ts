export enum PromptStyle {
  creative = 'creative',
  balanced = 'balanced',
  precise = 'precise',
}

export namespace Bing {
  export enum Api {
    chat = '/api_stream',
    createImage = '/create_image',
  }

  export interface Config {
    promptStyle: PromptStyle
    baseURL: string
  }
}
