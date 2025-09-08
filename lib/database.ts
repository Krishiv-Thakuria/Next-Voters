import { Database } from '@/types/database' 
import { Kysely } from 'kysely'
import { NeonDialect } from 'kysely-neon';
import { neon } from "@neondatabase/serverless";

const dialect = new NeonDialect({
  neon: neon(process.env.CONN_STRING)
})

export const db = new Kysely<Database>({
  dialect
})