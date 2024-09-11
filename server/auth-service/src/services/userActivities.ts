import db from "./db"
import hashPassword from "../util/hashPassword"
import {
  CourseProfessorUserInsert,
  InsertUserBase,
  SchoolHeadUserInsert,
  StudentOrProgramDirectorUserInsert,
} from "../interfaces/user"
import { hash } from "bun"

export const findUserByUsernameService = async (username: string) => {
  const results = await db.Connection.selectFrom("users")
    .selectAll()
    .where("username", "=", username)
    .limit(1)
    .execute()

  if (results.length === 0) return null
  else return results[0]
}

export const isPasswordMatchingService = (encryptedPswd: string, userGivenPswd: string) => {
  const passwordMathching = Bun.password.verifySync(userGivenPswd, encryptedPswd)
  return passwordMathching
}

export const addStudentOrProgramDirectorToDBService = async (
  userInfo: StudentOrProgramDirectorUserInsert,
  role: "STUDENT" | "PROGRAM_DIRECTOR",
) => {
  const hashedPassword = hashPassword(userInfo.password)

  const insertUserValue = {
    name: userInfo.name,
    password: hashedPassword,
    role_id: userInfo.roleId,
    school_id: userInfo.schoolId,
    username: userInfo.username,
    ...(userInfo.email && { email: userInfo.email }),
    ...(userInfo.phoneNumber && { phone_number: userInfo.phoneNumber }),
  }

  const userInsertionResults = await db.Connection.insertInto("users")
    .values(insertUserValue)
    .returning(["id"])
    .executeTakeFirstOrThrow()
  const userId = userInsertionResults.id

  if (role === "STUDENT")
    db.Connection.insertInto("students")
      .values({
        program_id: userInfo.programId,
        user_id: userId,
      })
      .execute()
  else if (role === "PROGRAM_DIRECTOR")
    db.Connection.insertInto("program_directors").values({ program_id: userInfo.programId, user_id: userId }).execute()

  return userId
}

export const addCourseProfessortToDBService = async (userInfo: CourseProfessorUserInsert) => {
  const { courseIds, name, password, roleId, schoolId, username, email, phoneNumber } = userInfo
  const hashedPassword = hashPassword(password)

  const insertUserValue = {
    name,
    password: hashedPassword,
    username,
    school_id: schoolId,
    role_id: roleId,
    ...(email && { email: email }),
    ...(phoneNumber && { phone_number: phoneNumber }),
  }

  const userInsertionResults = await db.Connection.insertInto("users")
    .values(insertUserValue)
    .returning("id")
    .executeTakeFirstOrThrow()

  const userId = userInsertionResults.id

  db.Connection.insertInto("course_professors")
    .values({ user_id: userId, course_ids: courseIds })
    .executeTakeFirstOrThrow()
}

export const addSchoolHeadToDBService = async (schoolHeadInfo: SchoolHeadUserInsert) => {
  const { name, password, roleId, schoolId, username, email, phoneNumber } = schoolHeadInfo
  const hashedPassword = hashPassword(password)

  const insertUserValue = {
    name,
    password: hashedPassword,
    username,
    school_id: schoolId,
    role_id: roleId,
    ...(email && { email: email }),
    ...(phoneNumber && { phone_number: phoneNumber }),
  }

  const userInsertionResults = await db.Connection.insertInto("users")
    .values(insertUserValue)
    .returning("id")
    .executeTakeFirstOrThrow()

  return userInsertionResults.id
}

export const addSysAdminToDBService = async (schoolHeadInfo: InsertUserBase) => {
  const { name, password, roleId, username, email, phoneNumber } = schoolHeadInfo

  const hashedPassword = hashPassword(password)

  const insertUserValue = {
    name,
    password: hashedPassword,
    username,
    role_id: roleId,
    ...(email && { email: email }),
    ...(phoneNumber && { phone_number: phoneNumber }),
  }

  const userInsertionResults = await db.Connection.insertInto("users")
    .values(insertUserValue)
    .returning("id")
    .executeTakeFirstOrThrow()

  return userInsertionResults
}
