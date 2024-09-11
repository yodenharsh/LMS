import db from "./db"

export const getAllUsersBySchoolId = async (schoolId: string, roles: string[]) => {
  const queryResults = db.Connection.selectFrom("users as u")
    .innerJoin("roles as r", "u.role_id", "r.id")
    .leftJoin("students as s", (join) => join.onRef("u.id", "=", "s.user_id").on("r.name", "=", "STUDENT"))
    .leftJoin("course_professors as cp", (join) =>
      join.onRef("u.id", "=", "cp.user_id").on("r.name", "=", "COURSE_PROFESSOR"),
    )
    .leftJoin("program_directors as pd", (join) =>
      join.onRef("u.id", "=", "pd.user_id").on("r.name", "=", "PROGRAM_DIRECTOR"),
    )
    .where("u.school_id", "=", schoolId)
    .where("u.role_id", "in", roles)
    .select([
      "u.id as user_id",
      "u.username",
      "u.email",
      "u.phone_number",
      "u.school_id",
      "u.role_id",
      "r.name as role_name",
      "s.program_id as program_id",
      "cp.course_ids as professor_course_ids",
      "pd.program_id as program_id",
    ])
    .orderBy("role_name")
    .execute()

  return queryResults
}
