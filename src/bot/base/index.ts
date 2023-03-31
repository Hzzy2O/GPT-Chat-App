import type { Bot } from '#/index'
import type { FormConfig } from '@/components/Form/types'
import { ls } from '@/utils/cache'
import { HistoryListDB } from '@/utils/IDB'

interface BaseConfig {
  baseURL: string
  [key: string]: any
}

/**
 * 基础模型
 **/
export abstract class BaseModel<T extends BaseConfig, U extends Bot> {
  private _lsCFK: string
  private _ak: string

  readonly history: HistoryListDB<U>

  /**
   * @description: 构造函数
   * @param name 模块名称
   * @param iconName 图标名称
   * @param config 配置
   * @param settingSchema 修改配置的表单结构
   * @param _lsCFK 本地存储键名
   **/
  constructor(
    readonly name: U,
    readonly iconName: string,
    public config: T,
    public settingSchema: FormConfig,
  ) {
    this._lsCFK = `bot_${name}_config`
    this._ak = `bot_${name}_apiKey`

    this.name = name
    this.history = new HistoryListDB(name)
    this.iconName = iconName
    this.config = reactive(Object.assign(config, ls.get(this._lsCFK) || {}))
    this.settingSchema = settingSchema

    if (!this.apiKey)
      this.apiKey = ''
  }

  get apiKey() {
    return ls.get(this._ak)
  }

  set apiKey(value: string) {
    ls.set(this._ak, value)
  }

  /**
   * @description: 聊天
   * @param msg 消息
   * @param doneDeal 完成回调
   * @return: void
   * */
  abstract chat(msg: string, doneDeal?: (done: boolean) => void): void

  /** @description: 创建图片
    * @param msg 提示文本
    * @return: void
    **/
  abstract createImage?(msg: string): void

  abstract editImage?(msg: string): void

  abstract recorder?(file: File): void

  abstract getBalance?(): Promise<{ total: string;used: string;available: string }>

  /**
   * @description: 设置config
   * @param 配置的属性 {keyof T} key
   * @param 配置的值 {T[keyof T]} value
   **/
  setConfigByKey(key: keyof T, value: T[keyof T]): void {
    this.config[key] = value
    ls.set(this._lsCFK, this.config)
  }
}
