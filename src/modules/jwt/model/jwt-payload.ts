import { UserId } from "../../user/model/user.id";

export interface JwtLoginPayload {
  id: UserId // NOTE: ask about UserId
}
