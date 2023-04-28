export namespace AutoGPT {
  export enum Api {
    GetAll = '/autogpt',
    Create = '/autogpt/create',
    Run = '/autogpt/run',
  }

  export interface Config {
    baseURL: string
    autorun: boolean
  }

  export interface GPTInfo {
    id: string
    ai_name: string
    ai_role: string
    ai_goals: string[]
    created_at: string
  }
}
