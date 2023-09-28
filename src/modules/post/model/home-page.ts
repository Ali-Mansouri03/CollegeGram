import { Follow } from "../../follow/model/follow"
import { PostId } from "./post-id"
import { Tag, Tags } from "../tag/dto/tag.dto"
import { User } from "../../user/model/user"
import { UserName } from "../../user/model/user.username"
import { z } from "zod"
import { UserId } from "../../user/model/user.id"

export interface HomePageUser {
  followingUsers: FollowingUser[]
}



export interface FollowingUser {
  UserName: UserName
}


export interface HomePagePost {
  id: PostId
  userId: UserId
  tags: {title: string, color: string}[]
  photos: string[]
}

export module HomePagePost {
  export const zod = z.object({
    id: PostId.zod,
    UserId: UserId.zod,
    tags: z.array(Tag.zod),
    photos: z.array(z.string())
  })
}

// export interface HomePagePosts{
//   HomePagePosts : HomePagePost[]
// }

export type HomePagePosts = HomePagePost[]


export module HomePagePosts {
  export const zod = z.array(HomePagePost.zod)
}



// export namespace FollowingUserOrNaot {
//   const isFollowingUser = (value: User, homeUser: UserHomePage): value is FollowingUser {
//     return homeUser.followingUsers.map((x: FollowingUser) => ({x.UserName})) 
//   }
//   const userName : UserName
// }

