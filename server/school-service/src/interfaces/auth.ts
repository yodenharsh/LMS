export interface JwtPayload {
  sub: string
  role: RoleEnum
  school?: string
  program?: string
  courseIds?: string
  iat: number
  expires_at: number
}

export type RoleEnum = "STUDENT" | "COURSE_PROFESSOR" | "PROGRAM_DIRECTOR" | "SCHOOL_HEAD" | "SYS_ADMIN"
