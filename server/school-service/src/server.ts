import app from "./app"
import * as os from "os"
import logger from "./common/logger"
import mongodb from "./services/db"

// to use env variables
import "./common/env"

const PORT = process.env.PORT || 8001

app.listen(PORT, () => {
  logger.info(`up and running in ${process.env.NODE_ENV || "development"} @: ${os.hostname()} on port ${PORT}`)
  mongodb.Connection
})
