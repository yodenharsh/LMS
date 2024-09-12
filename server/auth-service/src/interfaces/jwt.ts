export interface JwtPayload {
  sub: string
  role: string
  school?: string
  program?: string
  courseIds?: string[]
  expires_at: number
  iat: number
}
