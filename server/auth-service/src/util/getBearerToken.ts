import { Request } from "express"

export default function (req: Request) {
  const authHeader = req.headers.authorization

  if (!authHeader) return null
  const [authType, bearerToken] = authHeader.split(" ")
  if (authType.toLowerCase() != "bearer") return null
  else return bearerToken
}
