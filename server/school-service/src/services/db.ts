import logger from "../common/logger"
import { DB } from "kysely-codegen"
import { Pool } from "pg"

// to use env variables
import "../common/env"
import { Kysely, PostgresDialect } from "kysely"

const DB_URI = process.env.DATABASE_URL

// Get current connected Database
const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: DB_URI,
    }),
  }),
})

// Notify on error or success
// db.on("error", (err) => logger.error("connection with db error", err))
// db.on("close", () => logger.info("connection closed to db"))
// db.once("open", () => logger.info(`Connected to the database instance on ${DB_URI}`))

async function checkDBConn() {
  try {
    await db.selectFrom("schools").execute()
    logger.info(`Connection to the database on ${DB_URI}`)
  } catch (err) {
    logger.error("Connection with db error: " + err)
  }
}

checkDBConn()

export default {
  Connection: db,
}
