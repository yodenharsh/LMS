export type InsertUserBase = {
  username: string
  password: string
  name: string
  email?: string
  phoneNumber?: string
  roleId: string
}

export interface StudentOrProgramDirectorUserInsert extends InsertUserBase {
  schoolId: string
  programId: string
}

export interface CourseProfessorUserInsert extends InsertUserBase {
  schoolId: string
  courseIds: string[]
}
