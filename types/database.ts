import { Generated, ColumnType, Selectable, Insertable, Updateable } from 'kysely'

export interface Database {
  chat_count: ChatCountTable
}

export interface ChatCountTable {
  id: Generated<number>
  responses: number
  requests: number
}

export type ChatCount = Selectable<ChatCountTable>
export type NewChatCount = Insertable<ChatCountTable>
export type ChatCountUpdate = Updateable<ChatCountTable>
