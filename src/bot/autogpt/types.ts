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
    finish: boolean
    messages?: GPTAction[]
  }

  interface Reply {
    thoughts?: {
      text: string
      reasoning: string
      plan: string
      criticism: string
      speak: string
    }
    command: {
      name: string
      args: Record<string, any>
    }
  }

  export interface GPTAction {
    reply_json: Reply
    finish: boolean
    tool_result: {
      name: string
      result: string
    }
  }
}
