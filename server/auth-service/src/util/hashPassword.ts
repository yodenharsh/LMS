export default function (password: string) {
  const hash = Bun.password.hashSync(password)

  return hash
}
