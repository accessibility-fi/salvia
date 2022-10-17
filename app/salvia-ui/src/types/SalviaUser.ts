export type SalviaUser = {
  userName: string
  userId: string
}

export type UserInfo = {
  access_token: string
  user_claims: UserClaim[]
  user_id: string
  userName: string
}

export type UserClaim = {
  typ: string
  val: string
}
