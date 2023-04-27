import { last } from 'lodash-es'
import { AutoGPT } from '../types'
import { usePost } from '@/api/http'
import { useRecordStoreWithOut, useUIStoreWithOut } from '@/store'
import type { Flow } from '#/index'

type ResData = {
//   answer: string
//   done: boolean
//   token?: string
// } & Pick<Flow, 'urls' | 'suggests'>

