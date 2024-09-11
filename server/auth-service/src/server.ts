import app from "./app"
import * as os from "os"
import logger from "./common/logger"
import mongodb from "./services/db"
import { populateRolesService } from "./services/roles"

// to use env variables
import "./common/env"

// Populate roles table at startup
try {
  const result = await populateRolesService()
  if (typeof result === "bigint") logger.info(`Populated roles table with ${result} rows`)
} catch (err) {
  logger.error("Could not insert into roles table to populate it" + err)
}

const PORT = process.env.PORT

app.listen(PORT, () => {
  logger.info(`up and running in ${process.env.NODE_ENV || "development"} @: ${os.hostname()} on port ${PORT}`)
  mongodb.Connection
})
