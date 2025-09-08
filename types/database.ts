import { Generated, ColumnType, Selectable, Insertable, Updateable } from 'kysely'

export interface Database {
  chat_count: ChatCountTable
}

export interface ChatCountTable {
  id: Generated<number>

  // Global count of all chats
  responses: number

  // Last time count was updated
  updated_at: ColumnType<Date, string | undefined, never>
}

export type ChatCount = Selectable<ChatCountTable>
export type NewChatCount = Insertable<ChatCountTable>
export type ChatCountUpdate = Updateable<ChatCountTable>
