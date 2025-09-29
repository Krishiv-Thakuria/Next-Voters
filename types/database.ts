import { Generated, Selectable, Insertable, Updateable } from 'kysely'

export interface Database {
  chat_count: ChatCountTable,
  admin_table: UserAdminTable
}

export interface ChatCountTable {
  id: Generated<number>
  responses: number
  requests: number
}

export interface UserAdminTable {
  email: string
  name: string
}
export type ChatCount = Selectable<ChatCountTable>
export type NewChatCount = Insertable<ChatCountTable>
export type ChatCountUpdate = Updateable<ChatCountTable>

export type UserAdmin = Selectable<UserAdminTable>