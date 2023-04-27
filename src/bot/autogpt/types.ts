export namespace AutoGPT {
  export enum Api {
    create = '/gpt/create',
    run = '/gpt/run',
  }

  export interface Config {
    baseURL: string
  }
}
